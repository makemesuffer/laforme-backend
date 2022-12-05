import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsNumber,
} from 'class-validator';

import { Currency } from '../enum/payment.enum';

export class PaymentDto {
  @IsNotEmpty()
  @IsString()
  amount: string;

  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @IsNotEmpty()
  @IsString()
  orderNumber: string;

  @IsNotEmpty()
  @IsNumber()
  testMode: number;
}
