import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class FooterDto {
  @IsNotEmpty()
  @IsPhoneNumber('RU')
  phone: string;
}
