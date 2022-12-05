import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { PurchaseRepository } from '../purchase/purchase.repository';
import { UserRepository } from '../user/user.repository';
import { PageNavigationRepository } from '../page-navigation/page-navigation.repository';
import { PurchaseProductModule } from '../purchase-product/purchase-product.module';

@Module({
  imports: [
    PurchaseProductModule,
    TypeOrmModule.forFeature([
      PurchaseRepository,
      UserRepository,
      PageNavigationRepository,
    ]),
  ],
  providers: [StatisticsService],
  exports: [StatisticsService],
  controllers: [StatisticsController],
})
export class StatisticsModule {}
