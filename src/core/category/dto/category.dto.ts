import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { ProductTypeEnum } from 'src/common/enum/type.enum';

export class CategoryDto {
  @IsOptional()
  @IsUUID('all')
  id: string;

  @IsOptional()
  @IsString()
  categoryNameRu: string;

  @IsOptional()
  @IsString()
  categoryNameEn: string;

  @IsOptional()
  @IsEnum(ProductTypeEnum)
  type!: ProductTypeEnum;
}
