import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../models/room.entity';
import { Hotel } from '../models/hotel.entity';
import { Reservation } from 'src/models/reservation.entity';
import { CheckAvailabilityDto } from 'src/dtos/check-availability.dto';
import { FileService } from 'src/file/file.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @Inject(FileService)
    private filesService: FileService,
  ) {}

  async create(
    room: Room, 
    hotelId: string,
    image: Express.Multer.File
  ): Promise<Room> {
    if (image) {
      room.image = image.filename;
    }
    const hotel = await this.hotelRepository.findOne({ where: { id: hotelId } });
    if (!hotel) {
      throw new Error(`Hotel with id ${hotelId} not found`);
    }
    room.hotel = hotel;
    return this.roomRepository.save(room);
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomRepository.findOne({ where: { id: parseInt(id) }, relations: ['hotel'] });
    if (!room) {
      throw new Error(`Room with id ${id} not found`);
    }
    return room;
  }

  async findAll(): Promise<Room[]> {
    return this.roomRepository.find({ relations: ['hotel'] });
  }
  async checkAvailability(query: CheckAvailabilityDto): Promise<any[]> {
    // 1. Obtener todas las habitaciones
    const rooms = await this.roomRepository.find({
      relations: ['hotel'],
    });

    // 2. Verificar disponibilidad para cada habitación
    const availability = await Promise.all(
      rooms.map(async (room) => {
        // 3. Buscar reservas que se solapen con el rango de fechas
        const conflictingReservation = await this.reservationRepository
          .createQueryBuilder('reservation')
          .where('reservation.roomId = :roomId', { roomId: room.id })
          .andWhere(
            `(
              (reservation.checkInDate <= :end AND reservation.checkOutDate >= :start)
            )`,
            {
              start: query.start,
              end: query.end,
            },
          )
          .getExists();

        return {
          id: room.id,
          roomNumber: room.name,
          type: room.type,
          price: room.price,
          hotelId: room.hotel.id,
          isAvailable: !conflictingReservation,
        };
      }),
    );

    return availability;
  }



}