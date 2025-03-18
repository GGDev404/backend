import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservation } from '../models/reservation.entity';

export enum UserRole{
  HOTEL_OWNER = 'hotelOwner',
  CLIENT = 'client'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT
  })
  role: UserRole;

  @OneToMany(() => Reservation, reservation => reservation.user)
  reservations: Reservation[];

  

}

