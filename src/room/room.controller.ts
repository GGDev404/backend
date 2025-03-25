import { Controller, Post, Body, Get, Param, UsePipes, ValidationPipe, Query } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from '../models/room.entity';
import { CheckAvailabilityDto } from 'src/dtos/check-availability.dto';

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

  @Get('availability')
  @UsePipes(new ValidationPipe({ transform: true }))
  async checkAvailability(@Query() query: CheckAvailabilityDto) {
    return this.roomService.checkAvailability(query);
}
}