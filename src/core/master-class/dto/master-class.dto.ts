import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsBoolean,
  Min,
  Max,
  ArrayMinSize,
  ArrayMaxSize,
  IsObject,
  IsUUID,
} from 'class-validator';
import { CategoryDto } from 'src/core/category/dto/category.dto';
import { FileDto } from 'src/core/file-upload/dto/file-dto';
import { CreateRecommendationDto } from 'src/core/recommendation/dto/create-recommendation.dto';

export class MasterClassDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(0)
  type: number;

  @IsOptional()
  @IsBoolean()
  deleted: boolean;

  @IsNotEmpty()
  @IsString()
  titleRu: string;
  @IsOptional()
  @IsString()
  titleEn: string;

  @IsNotEmpty()
  @IsString()
  descriptionRu: string;
  @IsOptional()
  @IsString()
  descriptionEn: string;

  @IsNotEmpty()
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

  @IsNotEmpty()
  @IsObject()
  articleRu: {
    blocks: [];
    time: number;
    version: string;
  };
  @IsOptional()
  @IsObject()
  articleEn: {
    blocks: [];
    time: number;
    version: string;
  };

  @IsOptional()
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount: number;

  @IsOptional()
  @IsArray()
  categories: CategoryDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(6)
  images: FileDto[];

  @IsOptional()
  @IsObject()
  recommendation: CreateRecommendationDto;

  @IsOptional()
  @IsString()
  vendorCode: string;
}
