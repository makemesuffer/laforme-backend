import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

import { PostEntity } from 'src/core/post/post.entity';
import { SewingProductEntity } from 'src/core/sewing-product/sewing-product.entity';
import { PatternProductEntity } from 'src/core/pattern-product/pattern-product.entity';
import { MasterClassEntity } from 'src/core/master-class/master-class.entity';
import { CommentEntity } from '../comment.entity';

export class SubCommentDto {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsOptional()
  userId: string;

  @IsOptional()
  @IsString()
  postId: PostEntity;

  @IsOptional()
  @IsString()
  sewingProductId: SewingProductEntity;

  @IsOptional()
  @IsString()
  patternProductId: PatternProductEntity;

  @IsOptional()
  @IsString()
  masterClassId: MasterClassEntity;

  @IsNotEmpty()
  @IsString()
  commentId: CommentEntity;
}
