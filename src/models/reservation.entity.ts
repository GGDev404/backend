import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../models/user.entity';
import { Room } from '../models/room.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  checkInDate: Date;

  @Column()
  checkOutDate: Date;

  @Column()
  totalPrice: number;

  @Column()
  guests: number;

  @Column()
  status: 'pending' | 'confirmed';

  @ManyToOne(() => User, user => user.reservations)
  user: User;

  @ManyToOne(() => Room, room => room.reservations)
  room: Room;
}