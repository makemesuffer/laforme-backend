import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';

import { PostEntity } from '../post/post.entity';
import { UserEntity } from '../user/user.entity';
import { SewingProductEntity } from './../sewing-product/sewing-product.entity';
import { PatternProductEntity } from '../pattern-product/pattern-product.entity';
import { MasterClassEntity } from '../master-class/master-class.entity';

@Entity({ name: 'comment' })
export class CommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    name: 'text',
  })
  text!: string;

  @CreateDateColumn({
    name: 'create_date',
  })
  createDate: Date;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.comment)
  @JoinColumn({
    name: 'user_id',
  })
  userId!: UserEntity;

  @OneToMany(
    () => SubCommentEntity,
    (subComment: SubCommentEntity) => subComment.commentId,
  )
  subComment: SubCommentEntity[];

  @ManyToOne(() => PostEntity, (post: PostEntity) => post.comment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'post_id',
  })
  postId?: PostEntity;

  @ManyToOne(
    () => SewingProductEntity,
    (sewingProduct: SewingProductEntity) => sewingProduct.comment,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'sewing_product_id',
  })
  sewingProductId?: SewingProductEntity;

  @ManyToOne(
    () => PatternProductEntity,
    (patternProduct: PatternProductEntity) => patternProduct.comment,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'pattern_product_id',
  })
  patternProductId?: PatternProductEntity;

  @ManyToOne(
    () => MasterClassEntity,
    (masterClass: MasterClassEntity) => masterClass.comment,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'master_class_id',
  })
  masterClassId?: MasterClassEntity;
}

@Entity({ name: 'sub_comment' })
export class SubCommentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    name: 'text',
  })
  text!: string;

  @CreateDateColumn({
    name: 'create_date',
  })
  createDate: Date;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.comment)
  @JoinColumn({
    name: 'user_id',
  })
  userId!: UserEntity;

  @ManyToOne(() => PostEntity, (post: PostEntity) => post.comment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'post_id',
  })
  postId!: PostEntity;

  @ManyToOne(
    () => SewingProductEntity,
    (sewingProduct: SewingProductEntity) => sewingProduct.comment,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'sewing_product_id',
  })
  sewingProductId?: SewingProductEntity;

  @ManyToOne(
    () => PatternProductEntity,
    (patternProduct: PatternProductEntity) => patternProduct.comment,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'pattern_product_id',
  })
  patternProductId?: PatternProductEntity;

  @ManyToOne(
    () => MasterClassEntity,
    (masterClass: MasterClassEntity) => masterClass.comment,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'master_class_id',
  })
  masterClassId?: MasterClassEntity;

  @ManyToOne(
    () => CommentEntity,
    (comment: CommentEntity) => comment.subComment,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'comment_id',
  })
  commentId!: CommentEntity;
}
