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

    let codigo = this.generarCodigoVerificacion();
    reservation.verificationCode = codigo;
    
    // Enviar código de verificación al usuario
    await this.emailService.sendCode(
      user.email,
      user.name,
      codigo
    );



    return this.reservationRepository.save(reservation);
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find({ relations: ['user', 'room'] });
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({ where: { id }, relations: ['user', 'room'] });
    if (!reservation) {
      throw new Error(`Reservation with id ${id} not found`);
    }
    return reservation;
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

  async confirmReservation(verificationCode: any, reservationId: number): Promise<Reservation> {
    console.log('Este es el codigo de verificacion '+JSON.stringify(verificationCode));
    console.log('Este es el id de la reserva '+reservationId);
    const reservation = await this.reservationRepository
    .createQueryBuilder('reservation')
    .where('reservation.id = :id', { id : reservationId })
    .getOne();
    console.log('Esta es la reserva '+JSON.stringify(reservation));
    if (!reservation) {
      throw new Error('Reserva no encontrada');
    }
    if(!reservation.verificationCode == verificationCode.verificacionCode){
      throw new Error('Código de verificación inválido');
    }
    reservation.status = 'confirmed';
    return this.reservationRepository.save(reservation);
  }

  async sendCode(reservationId: number): Promise<void> {
    const reservation = await this.reservationRepository.findOne({ where: { id: reservationId }, relations: ['user'] });
    if (!reservation) {
      throw new Error('Reserva no encontrada');
    }
    const user = await this.userRepository.findOne({ where: { id: reservation.user.id } });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    if(reservation.verificationCode){
      await this.emailService.sendCode(
        user.email,
        user.name,
        reservation.verificationCode
      );
      return;
    }
    throw new Error('Código de verificación no encontrado');
  }

  async sentConfirmationEmail(reservationId: number): Promise<void> {
    console.log('Este es el id de la reserva '+ reservationId);
    const reservation = await this.reservationRepository.findOne({ where: { id: reservationId }, relations: ['user', 'room'] });
    console.log('Esta es la reserva '+JSON.stringify(reservation));
    if (!reservation) {
      throw new Error('Reserva no encontrada');
    }
    const user = await this.userRepository.findOne({ where: { id: reservation.user.id } });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    const room = await this.roomRepository.findOne({ where: { id: reservation.room.id } });
    if (!room) {
      throw new Error('Habitación no encontrada');
    }

      if(reservation.status == 'confirmed'){
        await this.emailService.sendReservationConfirmation(
          user.email,
          {
            nombreUsuario: user.name,
            verificationCode: reservation.verificationCode,
            detalles: [{
              roomNumber: room.id,
              checkIn: reservation.checkInDate,
              checkOut: reservation.checkOutDate,}]
          }
        );
        return;
      }

      throw new Error('Reserva no confirmada');

    }



  

generarCodigoVerificacion(): string {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let codigo = '';
  for (let i = 0; i < 8; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      codigo += caracteres[indice];
  }
  return codigo;
}
}