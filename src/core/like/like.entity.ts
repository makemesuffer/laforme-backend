import { UserEntity } from './../user/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PostEntity } from '../post/post.entity';
import { MasterClassEntity } from '../master-class/master-class.entity';
import { SewingProductEntity } from 'src/core/sewing-product/sewing-product.entity';
import { PatternProductEntity } from './../pattern-product/pattern-product.entity';

@Entity({ name: 'like' })
export class LikeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.like)
  @JoinColumn({
    name: 'user_id',
  })
  userId: UserEntity;

  @ManyToOne(() => PostEntity, (post: PostEntity) => post.like, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'post_id',
  })
  postId: PostEntity;

  @ManyToOne(
    () => MasterClassEntity,
    (masterClass: MasterClassEntity) => masterClass.like,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'master_class_id',
  })
  masterClassId: MasterClassEntity;

  @ManyToOne(
    () => SewingProductEntity,
    (sewingProduct: SewingProductEntity) => sewingProduct.like,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'sewing_product_id',
  })
  sewingProductId: SewingProductEntity;

  @ManyToOne(
    () => PatternProductEntity,
    (patternProduct: PatternProductEntity) => patternProduct.like,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'pattern_product_id',
  })
  patternProductId: PatternProductEntity;
}
