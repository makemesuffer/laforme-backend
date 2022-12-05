import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsObject,
  IsNumber,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { CategoryDto } from 'src/core/category/dto/category.dto';
import { FileDto } from 'src/core/file-upload/dto/file-dto';
import { CreateRecommendationDto } from 'src/core/recommendation/dto/create-recommendation.dto';

export class PostDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsNumber()
  @Min(4)
  @Max(4)
  type: number;

  @IsNotEmpty()
  @IsObject()
  image: FileDto;

  @IsOptional()
  @IsArray()
  categories: CategoryDto[];

  @IsOptional()
  @IsObject()
  recommendation: CreateRecommendationDto;

  @IsNotEmpty()
  @IsString()
  titleRu: string;
  @IsOptional()
  @IsString()
  titleEn: string;

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
  @IsString()
  vendorCode: string;
}
