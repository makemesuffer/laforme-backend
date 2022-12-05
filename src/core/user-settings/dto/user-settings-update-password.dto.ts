import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class UserSettingsUpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Transform((value) => value.trim())
  newPassword: string;
}
