import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation } from '../models/reservation.entity';
import { User } from '../models/user.entity';
import { Room } from '../models/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, User, Room])],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}