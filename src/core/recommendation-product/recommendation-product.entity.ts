import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MasterClassEntity } from '../master-class/master-class.entity';
import { PatternProductEntity } from '../pattern-product/pattern-product.entity';
import { SewingProductEntity } from '../sewing-product/sewing-product.entity';
import { RecommendationEntity } from '../recommendation/recommendation.entity';
import { PostEntity } from '../post/post.entity';

@Entity({ name: 'recommendation_product' })
export class RecommendationProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => MasterClassEntity,
    (masterClass: MasterClassEntity) => masterClass.recommendationProduct,
    { onDelete: 'SET NULL' },
  )
  @JoinColumn({
    name: 'master_class_id',
  })
  masterClassId: MasterClassEntity;

  @ManyToOne(
    () => PostEntity,
    (post: PostEntity) => post.recommendationProduct,
    { onDelete: 'SET NULL' },
  )
  @JoinColumn({
    name: 'post_id',
  })
  postId: PostEntity;

  @ManyToOne(
    () => PatternProductEntity,
    (patternProduct: PatternProductEntity) =>
      patternProduct.recommendationProduct,
    { onDelete: 'SET NULL' },
  )
  @JoinColumn({
    name: 'pattern_product_id',
  })
  patternProductId: PatternProductEntity;

  @ManyToOne(
    () => SewingProductEntity,
    (sewingProduct: SewingProductEntity) => sewingProduct.recommendationProduct,
    { onDelete: 'SET NULL' },
  )
  @JoinColumn({
    name: 'sewing_product_id',
  })
  sewingProductId: SewingProductEntity;

  @ManyToOne(
    () => RecommendationEntity,
    (recommendation: RecommendationEntity) =>
      recommendation.recommendationProducts,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'recommendation_id',
  })
  recommendation: RecommendationEntity;
}
