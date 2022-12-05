import { IsString, IsOptional } from 'class-validator';
import { PostEntity } from 'src/core/post/post.entity';
import { MasterClassEntity } from 'src/core/master-class/master-class.entity';
import { SewingProductEntity } from 'src/core/sewing-product/sewing-product.entity';
import { PatternProductEntity } from 'src/core/pattern-product/pattern-product.entity';

export class LikeDto {
  @IsOptional()
  @IsString()
  postId: PostEntity;

  @IsOptional()
  @IsString()
  masterClassId: MasterClassEntity;

  @IsOptional()
  @IsString()
  sewingProductId: SewingProductEntity;

  @IsOptional()
  @IsString()
  patternProductId: PatternProductEntity;
}
