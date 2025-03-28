import { IsNotEmpty } from 'class-validator';

export class CreateRomDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  type: string;
  @IsNotEmpty()
  price: number;
  @IsNotEmpty()
  amenities: string;
}
