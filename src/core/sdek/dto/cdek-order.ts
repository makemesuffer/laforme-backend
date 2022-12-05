import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CdekLocationDto } from './сdek-location.dto';
import { CdekPackageDto } from './cdek-packages.dto';

class СdekReceptionDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsArray()
  phones: { number: string }[];
}

export class CdekCreateOrderDto {
  @IsOptional() // Номер заказа в ИС Клиента (если не передан, будет присвоен номер заказа в ИС СДЭК - uuid)
  @IsString()
  number?: string;

  @IsNotEmpty()
  @IsNumber()
  tariff_code: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional() // Код ПВЗ СДЭК, на который будет производиться самостоятельный привоз клиентом
  @IsString() // Не может использоваться одновременно с from_location
  shipment_point?: string;

  @IsOptional() // Код ПВЗ СДЭК, на который будет доставлена посылка
  @IsString() // Не может использоваться одновременно с to_location
  delivery_point?: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => СdekReceptionDto)
  recipient: СdekReceptionDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CdekLocationDto)
  from_location?: CdekLocationDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CdekLocationDto)
  to_location?: CdekLocationDto;

  @IsNotEmpty()
  @IsArray()
  packages: CdekPackageDto[];
}
export class CdekUpdateOrderDto extends CdekCreateOrderDto {
  @IsOptional() // Идентификатор заказа в ИС СДЭК, который нужно изменить
  @IsString() // да, если не заполнен cdek_number
  uuid?: string;

  @IsOptional() // Номер заказа СДЭК, который нужно изменить
  @IsString() // да, если не заполнен uuid
  cdek_number?: string;
}

class CdekOrderType {
  request_uuid: string;
  type: TypeRequest;
  state: StatusCreateOrder;
  date_time: Date;
  errors: any[];
  warnings: any;
}
export enum StatusCreateOrder {
  'ACCEPTED',
  'WAITING ',
  'SUCCESSFUL ',
  'INVALID ',
}
export enum TypeRequest {
  'CREATE',
  'UPDATE',
  'DELETE',
  'AUTH',
  'GET',
}
class CdekEntityType {
  uuid: string;
  orders: {
    order_uuid: string;
  }[];
  copy_count: number;
  url: string;
  statuses: {
    code: EntityStatusCode;
    name: string;
    date_time: Date;
  }[];
}
export enum EntityStatusCode {
  'ACCEPTED',
  'PROCESSING',
  'READY',
  'REMOVED',
  'INVALID',
}

export class CdekOrderResponseDto {
  entity: CdekEntityType;
  requests: CdekOrderType[];
}
