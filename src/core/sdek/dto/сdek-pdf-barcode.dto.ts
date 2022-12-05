import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class СdekPdfOrBarcodeDto {
  @IsNotEmpty()
  @IsArray()
  orders: { order_uuid?: string; cdek_number?: string }[];

  @IsOptional()
  @IsNumber()
  copy_count?: number;
}
