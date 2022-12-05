import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SewingProductController } from './sewing-product.controller';
import { SewingProductService } from './sewing-product.service';
import { SewingProductRepository } from './sewing-product.repository';
import { ProductOptionModule } from '../product-option/product-option.module';
import { SewingProductEntity } from './sewing-product.entity';
import { PageNavigationRepository } from '../page-navigation/page-navigation.repository';
import { PurchaseProductModule } from '../purchase-product/purchase-product.module';

@Module({
  imports: [
    ProductOptionModule,
    PurchaseProductModule,
    TypeOrmModule.forFeature([
      SewingProductRepository,
      SewingProductEntity,
      PageNavigationRepository,
    ]),
  ],
  providers: [SewingProductService],
  exports: [SewingProductService],
  controllers: [SewingProductController],
})
export class SewingProductModule {}
