import { IsString, IsNotEmpty } from 'class-validator';

export class CreateGoogleUseDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  googleId: string;
}
