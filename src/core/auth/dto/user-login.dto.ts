import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  @IsString()
  @Transform((login) => login.toLowerCase())
  @Transform((value) => value.trim())
  login: string;

  @IsNotEmpty()
  @IsString()
  @Transform((value) => value.trim())
  password: string;
}
