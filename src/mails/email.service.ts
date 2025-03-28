// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {
    SendGrid.setApiKey(this.configService.getOrThrow<string>('SENDGRID_API_KEY'));
  }

  async sendReservationConfirmation(email: string, reservationDetails: any) {
    const msg = {
      to: email,
      from: this.configService.getOrThrow<string>('EMAIL_FROM'),
      subject: 'Confirmación de Reserva',
      html: `
        <h1>¡Reserva Confirmada!</h1>
        <p>Detalles de tu reserva:</p>
        <ul>
          <li>Hotel: ${reservationDetails.hotelName}</li>
          <li>Habitación: ${reservationDetails.roomNumber}</li>
          <li>Fecha de entrada: ${reservationDetails.checkIn}</li>
          <li>Fecha de salida: ${reservationDetails.checkOut}</li>
        </ul>
      `,
    };

    try {
      await SendGrid.send(msg);
      return { success: true };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Error al enviar el correo de confirmación');
    }
  }
}