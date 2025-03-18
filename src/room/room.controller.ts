import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from '../models/room.entity';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post(':hotelId')
  async create(@Body() room: Room, @Param('hotelId') hotelId: string): Promise<Room> {
    return this.roomService.create(room, hotelId);
  }

  @Get()
  async findAll(): Promise<Room[]> {
    return this.roomService.findAll();
  }
}