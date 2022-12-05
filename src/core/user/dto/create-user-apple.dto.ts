import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAppleUseDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  appleId: string;
}
