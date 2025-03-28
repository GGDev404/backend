import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Hotel } from '../models/hotel.entity';
import { Reservation } from '../models/reservation.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  price: number;

  @Column()
  amenities: string;

  @Column()
  image?: string;


  @ManyToOne(() => Hotel, hotel => hotel.rooms)
  hotel: Hotel;

  @OneToMany(() => Reservation, reservation => reservation.room)
  reservations: Reservation[];
}