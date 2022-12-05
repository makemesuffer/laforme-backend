import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CdekLocationDto {
  @IsOptional()
  @IsNumber()
  code?: number; // Код населенного пункта СДЭК

  @IsOptional()
  @IsString()
  postal_code?: string; // 	Почтовый индекс

  @IsOptional()
  @IsString()
  city?: string; // Название города

  @IsOptional()
  @IsString()
  address?: string; // Строка адреса
}
