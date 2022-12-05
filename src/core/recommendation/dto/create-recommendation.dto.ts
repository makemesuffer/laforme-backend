import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RecommendationDto } from './recommendation.dto';
import { RecommendationProductDto } from 'src/core/recommendation-product/dto/recommendation-product.dto';

export class CreateRecommendationDto {
  @ValidateNested()
  @Type(() => RecommendationDto)
  recommendation: RecommendationDto;

  @IsOptional()
  recommendationProducts: RecommendationProductDto[];
}
