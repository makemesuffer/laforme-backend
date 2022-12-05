import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PURCHASE_STATUS } from '../enum/purchase.status';
import { Transform, Type } from 'class-transformer';
import { UpdatePurchaseProductDto } from 'src/core/purchase-product/dto/purchase-product.dto';

export class UpdatePurchaseDto {
  @IsOptional()
  @IsEnum(PURCHASE_STATUS)
  orderStatus: number;

  @IsOptional()
  @IsEmail()
  @Transform((value) => value.toLowerCase())
  @Transform((value) => value.trim())
  email: string;

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
  @IsString()
  promoCode: string;

  @IsOptional()
  @IsString()
  comment: string;

  @ValidateNested()
  @Type(() => UpdatePurchaseProductDto)
  purchaseProducts: UpdatePurchaseProductDto[];

  @IsOptional()
  @IsString()
  shippingPrice: string;

  @IsOptional()
  @IsString()
  price: string;

  @IsOptional()
  @IsString()
  address: string;
}
