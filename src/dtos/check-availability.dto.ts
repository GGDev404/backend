import { IsDateString, IsNotEmpty } from 'class-validator';

export class CheckAvailabilityDto {
  @IsDateString()
  @IsNotEmpty()
  start: Date;

  @IsDateString()
  @IsNotEmpty()
  end: Date;
}