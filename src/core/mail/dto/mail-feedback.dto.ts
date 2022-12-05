import { IsEmail, IsNotEmpty } from 'class-validator';

export class MailFeedbackDto {
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
