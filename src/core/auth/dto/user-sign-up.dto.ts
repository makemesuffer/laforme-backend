import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsEmail,
} from 'class-validator';

export class UserSignUpDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-z0-9_]{3,16}$/)
  @Transform((login) => login.toLowerCase())
  @Transform((value) => value.trim())
  login: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Transform((login) => login.toLowerCase())
  @Transform((value) => value.trim())
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Transform((value) => value.trim())
  password: string;
}
