import { IsNotEmpty, IsNumber } from 'class-validator';

export class CraeteCoordinatesDTO {
  @IsNumber()
  @IsNotEmpty()
  lng: number;

  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  rider: number;
}
