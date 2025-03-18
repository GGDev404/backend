import { Controller, Post, Body, Get } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { Hotel } from '../models/hotel.entity';

@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  async create(@Body() hotel: Hotel): Promise<Hotel> {
    return this.hotelService.create(hotel);
  }

  @Get()
  async findAll(): Promise<Hotel[]> {
    return this.hotelService.findAll();
  }
}