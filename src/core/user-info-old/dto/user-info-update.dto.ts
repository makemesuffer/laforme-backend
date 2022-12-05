import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UserInfoUpdateDto {
  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  // TODO включить перед выходом в прод
  // @IsPhoneNumber('RU')
  phone: string;

  @IsOptional()
  @IsObject()
  country: {
    country: string;
    country_iso_code: string;
    label: string;
  };

  @IsOptional()
  @IsObject()
  city: {
    city: string;
    fias_id: string;
    fias_level: string;
    kladr_id: string;
    label: string;
    settlement: string;
  };

  @IsOptional()
  @IsObject()
  street: {
    fias_id: string;
    fias_level: string;
    label: string;
    street: string;
  };

  @IsOptional()
  @IsObject()
  house: {
    fias_id: string;
    fias_level: string;
    house: string;
    label: string;
  };

  @IsOptional()
  @IsObject()
  postal_code: {
    label: string;
    postal_code: string;
  };

  @IsNotEmpty()
  @IsObject()
  address: {
    country: string;
    city: string;
    settlement: string;
    street: string;
    house: string;
    postal_code: string;
    kladr_id: string;
  };
}
