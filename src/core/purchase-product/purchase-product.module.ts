import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseProductEntity } from './purchase-product.entity';
import { PurchaseProductRepository } from './purchase-product.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PurchaseProductRepository,
      PurchaseProductEntity,
    ]),
  ],
  exports: [
    TypeOrmModule.forFeature([
      PurchaseProductRepository,
      PurchaseProductEntity,
    ]),
  ],
})
export class PurchaseProductModule {}
