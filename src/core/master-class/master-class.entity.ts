import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { FileUploadEntity } from '../file-upload/file-upload.entity';
import { PurchaseProductEntity } from '../purchase-product/purchase-product.entity';
import { CategoryEntity } from '../category/category.entity';
import { LikeEntity } from '../like/like.entity';
import { CommentEntity } from '../comment/comment.entity';
import { RecommendationProductEntity } from '../recommendation-product/recommendation-product.entity';
import { RecommendationEntity } from '../recommendation/recommendation.entity';
import { generateVendorCode } from 'src/common/utils/vendor-coder';
import { CompilationProductEntity } from '../compilation-product/compilation-product.entity';

@Entity({ name: 'master_class' })
export class MasterClassEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'int',
    name: 'type',
    default: 0,
    readonly: true,
  })
  type: number;

  @Column({
    type: 'varchar',
    name: 'vendor_code',
  })
  vendorCode: string;

  @Column({
    type: 'int',
    name: 'click_count',
    default: 0,
  })
  clickCount?: number;

  @CreateDateColumn({
    name: 'created_date',
    readonly: true,
  })
  createdDate: Date;

  static getVendorCode() {
    return generateVendorCode();
  }

  @ManyToMany(() => CategoryEntity)
  @JoinTable()
  categories: CategoryEntity[];

  @OneToMany(
    () => FileUploadEntity,
    (res: FileUploadEntity) => res.masterClassId,
  )
  images: FileUploadEntity[];

  @OneToOne(
    () => RecommendationEntity,
    (res: RecommendationEntity) => res.masterClassId,
    { cascade: true },
  )
  recommendation: RecommendationEntity;

  @OneToMany(
    () => RecommendationProductEntity,
    (res: RecommendationProductEntity) => res.masterClassId,
  )
  recommendationProduct: RecommendationProductEntity[];

  @OneToMany(
    () => CompilationProductEntity,
    (res: CompilationProductEntity) => res.masterClassId,
  )
  compilationProduct: CompilationProductEntity[];

  @OneToMany(
    () => PurchaseProductEntity,
    (res: PurchaseProductEntity) => res.masterClassId,
  )
  purchaseProduct: PurchaseProductEntity[];

  @OneToMany(() => LikeEntity, (res: LikeEntity) => res.masterClassId, {})
  like: LikeEntity[];

  @OneToMany(() => CommentEntity, (res: CommentEntity) => res.masterClassId)
  comment: CommentEntity[];

  @Column({
    type: 'varchar',
    name: 'title_ru',
  })
  titleRu!: string;
  @Column({
    type: 'varchar',
    name: 'title_en',
    nullable: true,
  })
  titleEn: string;

  @Column({
    type: 'varchar',
    name: 'description_ru',
  })
  descriptionRu!: string;
  @Column({
    type: 'varchar',
    name: 'description_en',
    nullable: true,
  })
  descriptionEn: string;

  @Column({
    type: 'json',
    name: ' material_ru',
    nullable: true,
  })
  materialRu: {
    blocks: [];
    time: number;
    version: string;
  };
  @Column({
    type: 'json',
    name: ' material_en',
    nullable: true,
  })
  materialEn: {
    blocks: [];
    time: number;
    version: string;
  };

  @Column({
    type: 'varchar',
    name: 'modifier_ru',
    nullable: true,
  })
  modifierRu!: string;

  @Column({
    type: 'varchar',
    name: 'modifier_en',
    nullable: true,
  })
  modifierEn!: string;

  @Column({
    type: 'numeric',
    name: 'price',
    default: 0,
  })
  price!: number;

  @Column({
    type: 'int',
    name: 'discount',
    default: 0,
  })
  discount!: number;

  @Column({
    type: 'json',
    name: 'article_ru',
    nullable: true,
  })
  articleRu: {
    blocks: [];
    time: number;
    version: string;
  };

  @Column({
    type: 'json',
    name: 'article_en',
    nullable: true,
  })
  articleEn: {
    blocks: [];
    time: number;
    version: string;
  };

  @Column({
    type: 'bool',
    name: 'deleted',
    default: false,
  })
  deleted?: boolean;

  @Column({
    type: 'bool',
    name: 'in_english',
    default: false,
  })
  inEnglish?: boolean;
}
