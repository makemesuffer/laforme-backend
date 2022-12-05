import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { MasterClassEntity } from '../master-class/master-class.entity';
import { PatternProductEntity } from '../pattern-product/pattern-product.entity';
import { SewingProductEntity } from '../sewing-product/sewing-product.entity';

@Entity({ name: 'page_navigation_statistic' })
export class PageNavigationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'click_date',
    readonly: true,
  })
  clickDate: Date;

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

  @Column({
    type: 'int',
    name: 'count',
    default: 1,
  })
  count: number;
}
