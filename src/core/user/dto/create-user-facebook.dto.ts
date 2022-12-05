import { IsString, IsNotEmpty } from 'class-validator';

export class CreateFacebookUseDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  facebookId: string;
}
