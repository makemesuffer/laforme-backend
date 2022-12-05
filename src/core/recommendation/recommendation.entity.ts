import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { MasterClassEntity } from '../master-class/master-class.entity';
import { PatternProductEntity } from '../pattern-product/pattern-product.entity';
import { SewingProductEntity } from '../sewing-product/sewing-product.entity';
import { RecommendationProductEntity } from '../recommendation-product/recommendation-product.entity';
import { PostEntity } from '../post/post.entity';

@Entity({ name: 'recommendation' })
export class RecommendationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(
    () => MasterClassEntity,
    (masterClass: MasterClassEntity) => masterClass.recommendation,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'master_class_id',
  })
  masterClassId: MasterClassEntity;

  @ManyToOne(
    () => PatternProductEntity,
    (patternProduct: PatternProductEntity) => patternProduct.recommendation,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'pattern_product_id',
  })
  patternProductId: PatternProductEntity;

  @ManyToOne(
    () => SewingProductEntity,
    (sewingProduct: SewingProductEntity) => sewingProduct.recommendation,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'sewing_product_id',
  })
  sewingProductId: SewingProductEntity;

  @ManyToOne(() => PostEntity, (post: PostEntity) => post.recommendation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'post_id',
  })
  postId: PostEntity;

  @OneToMany(
    () => RecommendationProductEntity,
    (recommendationProduct: RecommendationProductEntity) =>
      recommendationProduct.recommendation,
    { cascade: true },
  )
  recommendationProducts: RecommendationProductEntity[];

  @CreateDateColumn({
    name: 'created_date',
    readonly: true,
  })
  createdDate: Date;
}
