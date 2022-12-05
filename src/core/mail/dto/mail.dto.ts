import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class MailDto {
  @IsEmail()
  @Transform((login) => login.toLowerCase())
  @Transform((value) => value.trim())
  email: string;
}
