import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../models/reservation.entity';
import { User } from '../models/user.entity';
import { Room } from '../models/room.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async create(reservation: Reservation, userId: string, roomId: number): Promise<Reservation> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
    
    if (!room) {
      throw new Error(`Room with id ${roomId} not found`);
    }
    
    reservation.user = user;
    reservation.room = room;
    return this.reservationRepository.save(reservation);
  }

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find({ relations: ['user', 'room'] });
  }
}