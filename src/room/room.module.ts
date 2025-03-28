import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { Room } from '../models/room.entity';
import { Hotel } from '../models/hotel.entity';
import { Reservation } from 'src/models/reservation.entity';
import { FileService } from 'src/file/file.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Hotel, Reservation])],
  controllers: [RoomController],
  providers: [RoomService, FileService],
})
export class RoomModule {}