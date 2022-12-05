import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Currency, Status } from './enum/payment.enum';

@Entity({ name: 'payment' })
export class PaymentEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'decimal',
    name: 'amount',
    default: 0,
    nullable: false,
  })
  amount: number;

  @Column({
    type: 'varchar',
    name: 'payment_method',
  })
  paymentMethod: string;

  @CreateDateColumn()
  createDate: number;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.RUB,
    nullable: false,
  })
  currency: Currency;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
    nullable: false,
  })
  status: Status;
}
