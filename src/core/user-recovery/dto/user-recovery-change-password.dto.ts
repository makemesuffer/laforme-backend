import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserRecoveryChangeCredentialsDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Transform((value) => value.trim())
  password: string;
}
