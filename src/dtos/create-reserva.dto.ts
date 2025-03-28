import { IsDate, IsNumber, IsEnum, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum ReservaStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed'
}

export class CreateReservaDto {
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    checkInDate: Date;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    checkOutDate: Date;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    totalPrice: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    guests: number;

    @IsNotEmpty()
    @IsEnum(ReservaStatus)
    status: ReservaStatus;
}