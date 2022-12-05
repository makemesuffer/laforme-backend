import {
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsString,
  IsArray,
  IsUrl,
} from 'class-validator';

export class CdekPackageDto {
  @IsOptional() // нет, если передается новая упаковка (с новым number)
  @IsString()
  package_id?: string; // Уникальный номер упаковки в ИС СДЭК

  @IsOptional() // Номер упаковки (можно использовать порядковый номер упаковки заказа или номер заказа),
  @IsString() // уникален в пределах заказа. Идентификатор заказа в ИС Клиента
  number?: string;

  @IsNotEmpty()
  @IsNumber()
  weight: number; // Общий вес (в граммах)

  @IsOptional()
  @IsNumber()
  length?: number;

  @IsOptional()
  @IsNumber()
  width?: number;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsArray()
  items?: CdekItemsDto[];
}

export class CdekItemsDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  ware_key: string; // Идентификатор/артикул товара

  @IsNotEmpty()
  @IsNumber()
  cost: number;

  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @IsNotEmpty()
  @IsNumber() // Количество единиц товара (в штуках)
  amount: number; // Количество одного товара в заказе может быть от 1 до 999

  @IsOptional()
  @IsUrl()
  url?: string; // Ссылка на сайт интернет-магазина с описанием товара
}
