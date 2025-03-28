import { Controller, Post, Body, Get, Param, UsePipes, ValidationPipe, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from '../models/room.entity';
import { CheckAvailabilityDto } from 'src/dtos/check-availability.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post(':hotelId')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async create(
    @Body() room: Room,
    @Param('hotelId') hotelId: string,
    @UploadedFile() image: Express.Multer.File
  ): Promise<Room> {
    if(image) {
      room.image = image.filename;
    }
    return this.roomService.create(room, hotelId, image);
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