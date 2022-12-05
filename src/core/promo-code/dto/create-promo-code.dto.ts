import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreatePromoCodeDto {
  @IsNotEmpty()
  discount: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  text: string;
}
