import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PatternProductEntity } from '../pattern-product/pattern-product.entity';
import { SewingProductEntity } from '../sewing-product/sewing-product.entity';
import { PurchaseProductEntity } from '../purchase-product/purchase-product.entity';
import { FileUploadEntity } from '../file-upload/file-upload.entity';

@Entity({ name: 'product_options' })
export class ProductOptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    name: 'vendor_code',
  })
  vendorCode: string;

  @Column({
    type: 'varchar',
    name: 'color_ru',
    nullable: true,
  })
  colorRu!: string;
  @Column({
    type: 'varchar',
    name: 'color_en',
    nullable: true,
  })
  colorEn!: string;

  @Column({
    type: 'varchar',
    name: 'size',
    nullable: true,
  })
  size!: string;

  @Column({
    type: 'numeric',
    name: 'price',
    nullable: true,
  })
  price!: number;

  @Column({
    type: 'int',
    name: 'discount',
    nullable: true,
  })
  discount!: number;

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
    type: 'boolean',
    name: 'option_visibility',
    default: true,
  })
  optionVisibility: boolean;

  @OneToMany(
    () => FileUploadEntity,
    (res: FileUploadEntity) => res.optionFilePdf,
  )
  filesPdf: FileUploadEntity[];

  @ManyToOne(
    () => PatternProductEntity,
    (res: PatternProductEntity) => res.options,
    { onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'pattern_product_id',
  })
  patternProductId: PatternProductEntity;

  @ManyToOne(
    () => SewingProductEntity,
    (res: SewingProductEntity) => res.options,
    { onUpdate: 'CASCADE', onDelete: 'CASCADE' },
  )
  @JoinColumn({
    name: 'sewing_product_id',
  })
  sewingProductId: SewingProductEntity;

  @OneToMany(
    () => PurchaseProductEntity,
    (res: PurchaseProductEntity) => res.optionId,
  )
  @JoinColumn({
    name: 'purchased_product_id',
  })
  purchasedProductId: PurchaseProductEntity[];
}
