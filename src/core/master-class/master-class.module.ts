import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterClassController } from './master-class.controller';
import { MasterClassService } from './master-class.service';
import { MasterClassRepository } from './master-class.repository';
import { MasterClassEntity } from './master-class.entity';
import { PageNavigationRepository } from '../page-navigation/page-navigation.repository';
import { PurchaseProductModule } from '../purchase-product/purchase-product.module';

@Module({
  imports: [
    PurchaseProductModule,
    TypeOrmModule.forFeature([
      MasterClassRepository,
      MasterClassEntity,
      PageNavigationRepository,
    ]),
  ],
  providers: [MasterClassService],
  exports: [MasterClassService],
  controllers: [MasterClassController],
})
export class MasterClassModule {}
