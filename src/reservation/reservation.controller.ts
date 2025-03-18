import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Reservation } from '../models/reservation.entity';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest, request } from 'express';
import { User } from 'src/decorators/user.decorator';


@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post(':roomId')
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() reservation: Reservation,
    @User('sub') userId: string,
    @Param('roomId') roomId: number,
  ): Promise<Reservation> {
    return this.reservationService.create(reservation, userId, roomId);
  }

  @Get()
  async findAll(): Promise<Reservation[]> {
    return this.reservationService.findAll();
  }
}