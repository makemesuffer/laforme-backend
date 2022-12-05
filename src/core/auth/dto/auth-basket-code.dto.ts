import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class AuthBasketForCodeDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform((login) => login.toLowerCase())
  @Transform((value) => value.trim())
  email: string;

  @IsNotEmpty()
  @IsString()
  @Transform((login) => login.toLowerCase())
  @Transform((value) => value.trim())
  code: string;
}
