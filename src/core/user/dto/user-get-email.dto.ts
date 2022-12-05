import { IsNotEmpty } from 'class-validator';

export class UserGetEmailDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  emailConfirmed: boolean;
}
