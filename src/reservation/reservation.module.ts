import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { Reservation } from '../models/reservation.entity';
import { User } from '../models/user.entity';
import { Room } from '../models/room.entity';
import { EmailService } from 'src/mails/email.service';
import { Hotel } from 'src/models/hotel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, User, Room,Hotel])],
  controllers: [ReservationController],
  providers: [ReservationService,EmailService],
})
export class ReservationModule {}