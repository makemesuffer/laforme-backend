import {
  IsNotEmpty,
  IsString,
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

export class ToLocationDto extends CdekLocationDto {
  kladr_code?: string | number;
}

export class CdekTariffListDto {
  @IsOptional()
  @IsDateString()
  date?: Date;

  @IsOptional()
  @IsNumber()
  @Max(1)
  @Min(1)
  type?: 1;

  @IsOptional()
  @IsString()
  lang?: 'rus' | 'eng';

  @IsOptional()
  @ValidateNested()
  @Type(() => CdekLocationDto)
  from_location: CdekLocationDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ToLocationDto)
  to_location: ToLocationDto;

  @IsOptional()
  @IsArray()
  packages: CdekPackageDto[];

  @IsOptional()
  @IsNumber()
  amount: number;
}

export interface TariffType {
  tariff_code: number;
  tariff_name: string;
  tariff_description?: string;
  delivery_mode: number;
  delivery_sum: number;
  period_min: number;
  period_max: number;
}

export class TariffCodesType {
  data: {
    tariff_codes: TariffType[];
    errors: any;
  };
}
