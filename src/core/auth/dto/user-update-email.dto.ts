import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateEmail {
  @IsNotEmpty()
  @IsString()
  @Transform((login) => login.toLowerCase())
  @Transform((value) => value.trim())
  codeOldEmail: string;

  @IsNotEmpty()
  @IsString()
  @Transform((login) => login.toLowerCase())
  @Transform((value) => value.trim())
  codeNewEmail: string;
}

export class UserUpdateEmailRawDataDto {
  @IsNotEmpty()
  @IsString()
  email: string;
}
