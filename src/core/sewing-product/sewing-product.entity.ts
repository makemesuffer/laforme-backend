import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinTable,
  ManyToMany,
  CreateDateColumn,
} from 'typeorm';
import { CategoryEntity } from '../category/category.entity';
import { FileUploadEntity } from '../file-upload/file-upload.entity';
import { ProductOptionEntity } from '../product-option/product-option.entity';
import { LikeEntity } from '../like/like.entity';
import { CommentEntity } from '../comment/comment.entity';
import { PurchaseProductEntity } from '../purchase-product/purchase-product.entity';
import { RecommendationProductEntity } from '../recommendation-product/recommendation-product.entity';
import { RecommendationEntity } from '../recommendation/recommendation.entity';
import { generateVendorCode } from 'src/common/utils/vendor-coder';
import { CompilationProductEntity } from '../compilation-product/compilation-product.entity';

@Entity({ name: 'sewing_product' })
export class SewingProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'int',
    name: 'type',
    default: 3,
    readonly: true,
  })
  type!: number;

  @Column({
    type: 'int',
    name: 'option_type',
    default: 0,
  })
  optionType?: number;

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
    (res: FileUploadEntity) => res.sewingProductId,
  )
  images: FileUploadEntity[];

  @OneToMany(
    () => ProductOptionEntity,
    (res: ProductOptionEntity) => res.sewingProductId,
    { cascade: true, onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  )
  options: ProductOptionEntity[];

  @OneToOne(
    () => RecommendationEntity,
    (res: RecommendationEntity) => res.sewingProductId,
    { cascade: true },
  )
  recommendation: RecommendationEntity;

  @OneToMany(
    () => RecommendationProductEntity,
    (res: RecommendationProductEntity) => res.sewingProductId,
  )
  recommendationProduct: RecommendationProductEntity[];

  @OneToMany(
    () => CompilationProductEntity,
    (res: CompilationProductEntity) => res.sewingProductId,
  )
  compilationProduct: CompilationProductEntity[];

  @OneToMany(
    () => PurchaseProductEntity,
    (res: PurchaseProductEntity) => res.sewingProductId,
  )
  purchaseProduct: PurchaseProductEntity[];

  @OneToMany(() => LikeEntity, (res: LikeEntity) => res.sewingProductId)
  like: LikeEntity[];

  @OneToMany(() => CommentEntity, (res: CommentEntity) => res.sewingProductId)
  comment: CommentEntity[];

  @Column({
    type: 'int',
    name: 'discount',
    nullable: true,
  })
  discount?: number;

  @Column({
    type: 'numeric',
    name: 'price',
    nullable: true,
  })
  price?: number;

  @Column({
    type: 'int',
    name: 'count',
    nullable: true,
  })
  count!: number;

  @Column({
    type: 'numeric',
    name: 'length',
    nullable: true,
  })
  length!: number;

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
  titleEn!: string;

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
  descriptionEn!: string;

  @Column({
    type: 'varchar',
    name: 'description_old',
    nullable: true,
  })
  descriptionOld!: string;

  @Column({
    type: 'varchar',
    name: 'material_old',
    nullable: true,
  })
  materialOld!: string;

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
    type: 'bool',
    name: 'is_count',
    default: false,
  })
  isCount?: boolean;
  @Column({
    type: 'bool',
    name: 'is_length',
    default: false,
  })
  isLength?: boolean;

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
