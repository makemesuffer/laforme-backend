import { IsNotEmpty, IsString } from 'class-validator';
export class CheckPromoCodeDto {
  @IsNotEmpty()
  @IsString()
  text: string;
}
