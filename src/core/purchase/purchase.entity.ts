import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Generated,
  BaseEntity,
  AfterInsert,
} from 'typeorm';
import { PurchaseProductEntity } from '../purchase-product/purchase-product.entity';
import { UserEntity } from '../user/user.entity';
import { IsEmail } from 'class-validator';
import { PURCHASE_STATUS, DELIVERY_TYPE } from './enum/purchase.status';

@Entity({ name: 'purchase' })
export class PurchaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Generated()
  _NID: number;

  @AfterInsert()
  generateOrderNumber() {
    const defaultId = '0000000000';
    this.orderNumber =
      defaultId.substring(0, defaultId.length - this._NID.toString().length) +
      this._NID;
  }

  @Column({ type: 'varchar', nullable: true })
  orderNumber: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.purchase)
  @JoinColumn({
    name: 'user_id',
  })
  userId: UserEntity;

  @OneToMany(
    () => PurchaseProductEntity,
    (purchaseProduct: PurchaseProductEntity) => purchaseProduct.purchase,
    { cascade: true },
  )
  purchaseProducts: PurchaseProductEntity[];

  @CreateDateColumn({
    name: 'created_date',
    readonly: true,
    type: 'timestamptz',
  })
  createdDate: Date;

  @Column({
    type: 'varchar',
    name: 'email',
  })
  @IsEmail()
  email: string;

  @Column({
    type: 'varchar',
    name: 'first_name',
  })
  firstName: string;

  @Column({
    type: 'varchar',
    name: 'last_name',
  })
  lastName: string;

  @Column({
    type: 'varchar',
    name: 'phone',
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'varchar',
    name: 'comment',
    nullable: true,
  })
  comment?: string;

  @Column({
    type: 'varchar',
    name: 'address',
    nullable: true,
  })
  address: string;

  @Column({
    type: 'numeric',
    name: 'shipping_price',
    default: 0,
  })
  shippingPrice: number;

  @Column({
    type: 'numeric',
    name: 'price',
  })
  price: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  promoCode: string;

  @Column({
    type: 'int',
    default: 0,
  })
  promoCodeDiscount?: number;

  @Column({
    type: 'enum',
    enum: PURCHASE_STATUS,
    default: PURCHASE_STATUS.CREATED,
  })
  orderStatus: PURCHASE_STATUS;

  @Column({
    type: 'bool',
    default: false,
  })
  isDelivery: boolean;

  @Column({
    type: 'enum',
    enum: DELIVERY_TYPE,
    nullable: true,
  })
  deliveryType: DELIVERY_TYPE;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  deliveryName: string;

  @Column({
    type: 'int',
    name: 'cdek_tariff_code',
    nullable: true,
  })
  cdekTariffCode: number;

  @Column({
    type: 'int',
    name: 'cdek_city_code',
    nullable: true,
  })
  cdekCityCode: number;

  @Column({
    type: 'varchar',
    name: 'cdek_city_name',
    nullable: true,
  })
  cdekCityName: string;

  @Column({
    type: 'varchar',
    name: 'cdek_point_code',
    nullable: true,
  })
  cdekPointCode: string;

  @Column({
    type: 'varchar',
    name: 'cdek_point_address',
    nullable: true,
  })
  cdekPointAddress: string;
}
