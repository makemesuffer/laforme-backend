import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatternProductController } from './pattern-product.controller';
import { PatternProductService } from './pattern-product.service';
import { PatternProductRepository } from './pattern-product.repository';
import { ProductOptionModule } from '../product-option/product-option.module';
import { PatternProductEntity } from './pattern-product.entity';
import { PageNavigationRepository } from '../page-navigation/page-navigation.repository';
import { ProductOptionRepository } from '../product-option/product-option.repository';
import { PurchaseProductModule } from '../purchase-product/purchase-product.module';

@Module({
  imports: [
    ProductOptionModule,
    PurchaseProductModule,
    TypeOrmModule.forFeature([
      PatternProductRepository,
      PatternProductEntity,
      PageNavigationRepository,
      ProductOptionRepository,
    ]),
  ],
  providers: [PatternProductService],
  exports: [PatternProductService],
  controllers: [PatternProductController],
})
export class PatternProductModule {}
