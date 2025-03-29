// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { from } from 'rxjs';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {
    SendGrid.setApiKey(this.configService.getOrThrow<string>('SENDGRID_API_KEY'));
  }

  async sendCode(email: string, nombreUsuario:string, verificationCode: string) {
    const msg = {
      to: email,
      from: this.configService.get<string>('EMAIL_FROM') ||'admin@paradise.com',
      templateId: 'd-63debd3c552443efaf858138d69c5e83',
      dynamic_template_data: {
        nombreUsuario: nombreUsuario,
        verificationcode: verificationCode,
      },
      subject: 'Código de verificación',
    };
    try {
      await SendGrid.send(msg);
      return { success: true };
    } catch (error: any) {
      console.error('Error al enviar correo:', error);
      if (error.response) {
        console.error('Detalles de la respuesta de SendGrid:', error.response.body.errors);
      }
      throw new Error('Error al enviar el correo de confirmación');
    }
  }

  async sendReservationConfirmation(email: string, reservationDetails: any) {
    const msg = {
      to: email,
      from: this.configService.get<string>('EMAIL_FROM') || 'admin@paradise.com', // Provide a default or use getOrThrow
      templateId: 'd-f03f0ceaeae249c586c5a4b424c19709', // Aquí pones tu Template ID
      dynamic_template_data: {
        date: reservationDetails.date,
        nombreUsuario: reservationDetails.nombreUsuario,
        verificationcode: reservationDetails.verificationCode,
        telefono: reservationDetails.telefono,
        roomNumber: reservationDetails.roomNumber,
        checkIn: reservationDetails.checkIn,
        checkOut: reservationDetails.checkOut,
        price : reservationDetails.price,
        guests: reservationDetails.guests,
      },
      subject: 'Confirmación de reserva',
    };

    try {
      await SendGrid.send(msg);
      return { success: true };
    } catch (error: any) {
      console.error('Error al enviar correo:', error);
      if (error.response) {
        console.error('Detalles de la respuesta de SendGrid:', error.response.body.errors);
      }
      throw new Error('Error al enviar el correo de confirmación');
    }
  }
}