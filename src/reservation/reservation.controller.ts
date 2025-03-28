import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Reservation } from '../models/reservation.entity';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest, request } from 'express';
import { User } from 'src/decorators/user.decorator';
import { ReservedDaysResponseDTO } from 'src/dtos/reserved-days.dto';


@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post(':roomId')
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() reservation: Reservation,
    @User('email') email: string,
    @Param('roomId') roomId: number,
  ): Promise<Reservation> {
     console.log('Este es el id del usuario '+ email)
    return this.reservationService.create(reservation, email, roomId);
  }

  @Get()
  async findAll(): Promise<Reservation[]> {
    return this.reservationService.findAll();
  }


  @Get('/room/:roomId/reserved-days')
  async getReservedDays(
    @Param('roomId') roomId: number,
  ): Promise<ReservedDaysResponseDTO> {
    return this.reservationService.getReservedDays(roomId);
  }

}