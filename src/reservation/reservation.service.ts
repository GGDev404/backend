import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../models/reservation.entity';
import { User } from '../models/user.entity';
import { Room } from '../models/room.entity';
import { ReservedDaysResponseDTO } from 'src/dtos/reserved-days.dto';
import { EmailService } from 'src/mails/email.service';
import { Hotel } from 'src/models/hotel.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @Inject(EmailService)
    private emailService: EmailService,
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>
    
  ) {}

  async create(reservation: Reservation, email: string, roomId: number): Promise<Reservation> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    const room = await this.roomRepository.findOne({ where: { id: roomId } , relations: ['hotel']});
    
    if (!user) {
      throw new Error(`User with id ${email} not found`);
    }
    
    if (!room) {
      throw new Error(`Room with id ${roomId} not found`);
    }

    console.log(JSON.stringify(room));
    
    const hotel = await this.hotelRepository.findOne({ where: { id: room.hotel.id } });
    
    if (!hotel) {
      throw new Error(`Hotel with id ${room.hotel.id} not found`);
    }
    
    reservation.user = user;
    reservation.room = room;
    
    console.log('Sending email...');
    console.log("reservation"+JSON.stringify(reservation));
    console.log('userId' + email);
    console.log('user' + JSON.stringify(user));
    console.log('hotel' + JSON.stringify(hotel));

    // await this.emailService.sendReservationConfirmation(
    //   user.email,
    //   {
    //     hotelName: hotel.name,
    //     roomNumber: room.id,
    //     checkIn: reservation.checkInDate,
    //     checkOut: reservation.checkOutDate,
    //   }
    // );



    return this.reservationRepository.save(reservation);
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find({ relations: ['user', 'room'] });
  }

  async getReservedDays(roomId: number): Promise<ReservedDaysResponseDTO> {
    // Obtener todas las reservas de la habitación
    const reservations = await this.reservationRepository.find({
      where: { room: { id: roomId } },
      select: ['checkInDate', 'checkOutDate'],
    });

    // Generar lista de días reservados
    const bookedDates: string[] = [];
    
    reservations.forEach((reservation) => {
      const start = new Date(reservation.checkInDate);
      const end = new Date(reservation.checkOutDate);
      
      // Agregar todos los días entre checkIn y checkOut (incluyendo ambos)
      while (start <= end) {
        bookedDates.push(start.toISOString().split('T')[0]); // Formato YYYY-MM-DD
        start.setDate(start.getDate() + 1);
      }
    });

    return { bookedDates };
  }

  


}