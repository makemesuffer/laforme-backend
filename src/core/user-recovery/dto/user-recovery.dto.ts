import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UserRecoveryDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Transform((value) => value.toLowerCase())
  @Transform((value) => value.trim())
  email: string;
}
