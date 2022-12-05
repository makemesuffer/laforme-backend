import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'promo-code' })
export class PromoCodeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    name: 'text',
  })
  text: string;

  @Column({
    type: 'varchar',
    name: 'reward',
  })
  discount: number;

  @CreateDateColumn({
    name: 'created_date',
    readonly: true,
  })
  createdDate: Date;
}
