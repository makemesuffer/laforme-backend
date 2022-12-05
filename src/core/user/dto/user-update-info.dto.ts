import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsPhoneNumber,
  ValidateNested,
  IsNotEmpty,
  IsObject,
} from 'class-validator';

export class UserUpdateInfoAddressDto {
  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsObject()
  unrestricted_value: object;
}

export class UserUpdateInfoDto {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  // TODO включить перед выходом в прод
  // @IsPhoneNumber('RU')
  phone: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserUpdateInfoAddressDto)
  address: UserUpdateInfoAddressDto;
}
