import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsObject,
  Min,
  Max,
  ArrayNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
  IsBoolean,
} from 'class-validator';
import { CategoryDto } from 'src/core/category/dto/category.dto';
import { FileDto } from 'src/core/file-upload/dto/file-dto';
import { ProductOptionDto } from 'src/core/product-option/dto/product-option.dto';
import { CreateRecommendationDto } from 'src/core/recommendation/dto/create-recommendation.dto';

export class PatternProductDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(2)
  type: number;

  @IsNotEmpty()
  @IsString()
  titleRu: string;
  @IsOptional()
  @IsString()
  titleEn: string;

  @IsOptional()
  @IsString()
  descriptionRu: string;
  @IsOptional()
  @IsString()
  descriptionEn: string;

  @IsOptional()
  @IsObject()
  materialRu: {
    blocks: [];
    time: number;
    version: string;
  };
  @IsOptional()
  @IsObject()
  materialEn: {
    blocks: [];
    time: number;
    version: string;
  };
  @IsOptional()
  @IsString()
  modifierRu: string;
  @IsOptional()
  @IsString()
  modifierEn: string;

  @IsOptional()
  @IsArray()
  categories: CategoryDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(6)
  images: FileDto[];

  @IsOptional()
  @IsArray()
  filesPdf: FileDto[];

  @IsOptional()
  @IsObject()
  recommendation: CreateRecommendationDto;

  @IsOptional()
  @IsArray()
  options: ProductOptionDto[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  complexity: number;

  @IsOptional()
  @IsBoolean()
  deleted: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  count: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(3)
  optionType: number;

  @IsOptional()
  @IsString()
  vendorCode: string;

  @IsOptional()
  @IsBoolean()
  isCount: boolean;
}
