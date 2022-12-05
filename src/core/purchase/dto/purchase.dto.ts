import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsBoolean,
  IsEnum,
  ValidateNested,
  IsObject,
  ValidateIf,
} from 'class-validator';
import { CDEK_TARIFF_CODE } from 'src/core/sdek/enum/cdek-tariff-code';
import { DELIVERY_TYPE } from './../enum/purchase.status';

export class createPurchaseAddressDto {
  @IsNotEmpty()
  @IsString()
  value: string;

  @IsNotEmpty()
  @IsObject()
  unrestricted_value: object;
}

// @IsOptional()
// @IsNumber()
// userId: number;
// @IsOptional()
// @IsNumber()
// price: number;
// @IsOptional()
// @IsNumber()
// promoCodeDiscount: number;
// @IsOptional()
// @IsNumber()
// shippingPrice: number;
export class PurchaseDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform((value) => value.toLowerCase())
  @Transform((value) => value.trim())
  email: string;

  @IsOptional()
  @IsString()
  @Transform((value) => value.toLowerCase())
  @Transform((value) => value.trim())
  emailConfirmCode: string;

  @ValidateIf((o: PurchaseDto) => o.isDelivery)
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ValidateIf((o: PurchaseDto) => o.isDelivery)
  @IsNotEmpty()
  // TODO включить перед выходом в прод
  // @IsPhoneNumber('RU')
  phone: string;

  @IsOptional()
  @IsString()
  comment: string;

  @ValidateIf((o: PurchaseDto) => o.isDelivery)
  @IsOptional()
  @ValidateNested()
  @Type(() => createPurchaseAddressDto)
  address: createPurchaseAddressDto;

  @IsOptional()
  @IsString()
  promoCode: string;

  @IsNotEmpty()
  @IsBoolean()
  isDelivery: boolean;

  @ValidateIf((o: PurchaseDto) => o.isDelivery)
  @IsOptional()
  @IsEnum(DELIVERY_TYPE)
  deliveryType: DELIVERY_TYPE;

  @ValidateIf((o: PurchaseDto) => o.isDelivery)
  @IsNotEmpty()
  @IsString()
  deliveryName: string;

  @ValidateIf((o: PurchaseDto) => {
    return (
      o.isDelivery &&
      (o.deliveryType === DELIVERY_TYPE.CDEK_COURIER ||
        o.deliveryType === DELIVERY_TYPE.CDEK_POINT)
    );
  })
  @IsNotEmpty()
  @IsEnum(CDEK_TARIFF_CODE)
  cdekTariffCode: CDEK_TARIFF_CODE;

  @ValidateIf((o) => {
    return o.isDelivery && o.deliveryType === DELIVERY_TYPE.CDEK_POINT;
  })
  @IsNotEmpty()
  @Transform((value) => +value)
  @IsNumber()
  cdekCityCode: number;

  @ValidateIf((o) => {
    return o.isDelivery && o.deliveryType === DELIVERY_TYPE.CDEK_POINT;
  })
  @IsNotEmpty()
  @IsString()
  cdekCityName: string;

  @ValidateIf((o) => {
    return o.isDelivery && o.deliveryType === DELIVERY_TYPE.CDEK_POINT;
  })
  @IsNotEmpty()
  @IsString()
  cdekPointCode: string;

  @ValidateIf((o) => {
    return o.isDelivery && o.deliveryType === DELIVERY_TYPE.CDEK_POINT;
  })
  @IsNotEmpty()
  @IsString()
  cdekPointAddress: string;
}
