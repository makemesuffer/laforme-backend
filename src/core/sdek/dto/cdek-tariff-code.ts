import {
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsNumber,
  ValidateNested,
  IsDateString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CdekLocationDto } from './сdek-location.dto';
import { CdekPackageDto } from './cdek-packages.dto';

export class CdekTariffCodeDto {
  @IsOptional()
  @IsDateString()
  date?: Date;

  @IsOptional()
  @IsNumber()
  @Max(1)
  @Min(1)
  type?: 1;

  @IsNotEmpty()
  @IsNumber()
  tariff_code: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CdekLocationDto)
  from_location?: CdekLocationDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CdekLocationDto)
  to_location: CdekLocationDto;

  @IsOptional()
  @IsArray()
  packages?: CdekPackageDto[];

  @IsOptional()
  @IsNumber()
  amount: number;
}

export class CdekTariffByCode {
  delivery_sum: number;
  period_min: number;
  period_max: number;
  weight_calc: number;
  total_sum: number;
  currency: string;
  errors?: any;
}
