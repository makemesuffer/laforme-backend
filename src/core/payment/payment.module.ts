import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PurchaseRepository } from '../purchase/purchase.repository';
import { SdekModule } from '../sdek/sdek.module';
import { PurchaseModule } from '../purchase/purchase.module';
import { PaymentEntity } from 'src/core/payment/payment.entity';

@Module({
  imports: [
    SdekModule,
    forwardRef(() => PurchaseModule),
    TypeOrmModule.forFeature([UserEntity, PaymentEntity, PurchaseRepository]),
  ],
  providers: [PaymentService],
  exports: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
