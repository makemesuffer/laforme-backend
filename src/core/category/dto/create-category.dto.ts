import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { ProductTypeEnum } from 'src/common/enum/type.enum';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @IsNotEmpty()
  @IsEnum(ProductTypeEnum)
  type: ProductTypeEnum;
}
