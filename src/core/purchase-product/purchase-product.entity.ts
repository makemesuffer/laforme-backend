import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { PurchaseEntity } from '../purchase/purchase.entity';
import { MasterClassEntity } from './../master-class/master-class.entity';
import { PatternProductEntity } from '../pattern-product/pattern-product.entity';
import { SewingProductEntity } from '../sewing-product/sewing-product.entity';
import { ProductOptionEntity } from '../product-option/product-option.entity';

@Entity({ name: 'purchase_product' })
export class PurchaseProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_date',
    readonly: true,
  })
  createdDate: Date;

  @ManyToOne(
    () => PurchaseEntity,
    (res: PurchaseEntity) => res.purchaseProducts,
  )
  @JoinColumn({
    name: 'purchase_id',
  })
  purchase: PurchaseEntity;

  @ManyToOne(
    () => MasterClassEntity,
    (res: MasterClassEntity) => res.purchaseProduct,
  )
  @JoinColumn({
    name: 'master_class_id',
  })
  masterClassId: MasterClassEntity;

  @ManyToOne(
    () => PatternProductEntity,
    (res: PatternProductEntity) => res.purchaseProduct,
  )
  @JoinColumn({
    name: 'pattern_product_id',
  })
  patternProductId: PatternProductEntity;

  @ManyToOne(
    () => SewingProductEntity,
    (res: SewingProductEntity) => res.purchaseProduct,
  )
  @JoinColumn({
    name: 'sewing_product_id',
  })
  sewingProductId: SewingProductEntity;

  @ManyToOne(
    () => ProductOptionEntity,
    (res: ProductOptionEntity) => res.purchasedProductId,
    { nullable: true },
  )
  @JoinColumn({
    name: 'option_id',
  })
  optionId: ProductOptionEntity;

  @Column({
    type: 'int',
    name: 'type',
  })
  type: number;

  @Column({
    type: 'int',
    name: 'total_count',
    nullable: true,
  })
  totalCount: number;

  @Column({
    type: 'numeric',
    name: 'total_length',
    nullable: true,
  })
  totalLength: number;

  @Column({
    type: 'int',
    name: 'total_discount',
    nullable: true,
  })
  totalDiscount: number;

  @Column({
    type: 'bool',
    name: 'is_open',
    default: false,
  })
  isOpen: boolean;

  @Column({
    type: 'bool',
    name: 'is_closed',
    default: false,
  })
  isClosed: boolean;

  @Column({
    name: 'expired_date',
    nullable: true,
  })
  expiredDate: Date;

  @Column({
    type: 'numeric',
    name: 'total_price',
  })
  totalPrice: number;
}
