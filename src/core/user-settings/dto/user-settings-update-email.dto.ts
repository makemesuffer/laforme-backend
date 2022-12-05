import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserSettingsUpdateEmailDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform((login) => login.toLowerCase())
  @Transform((value) => value.trim())
  newEmail: string;

  @IsNotEmpty()
  @IsEmail()
  @Transform((login) => login.toLowerCase())
  @Transform((value) => value.trim())
  oldEmail: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Transform((value) => value.trim())
  password: string;
}
