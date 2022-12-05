import { IsString, IsOptional } from 'class-validator';
import { MasterClassEntity } from 'src/core/master-class/master-class.entity';
import { PatternProductEntity } from 'src/core/pattern-product/pattern-product.entity';
import { SewingProductEntity } from 'src/core/sewing-product/sewing-product.entity';

export class RecommendationDto {
  @IsOptional()
  @IsString()
  masterClassId: MasterClassEntity;

  @IsOptional()
  @IsString()
  patternProductId: PatternProductEntity;

  @IsOptional()
  @IsString()
  sewingProductId: SewingProductEntity;
}
