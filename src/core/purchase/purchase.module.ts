import { SdekModule } from './../sdek/sdek.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseController } from './purchase.controller';
import { PurchaseRepository } from './purchase.repository';
import { PurchaseService } from './purchase.service';
import { PatternProductModule } from '../pattern-product/pattern-product.module';
import { MasterClassModule } from '../master-class/master-class.module';
import { SewingProductModule } from '../sewing-product/sewing-product.module';
import { PromoCodeModule } from '../promo-code/promo-code.module';
import { PurchaseProductModule } from '../purchase-product/purchase-product.module';
import { MailModule } from '../mail/mail.module';
import { PurchaseEntity } from './purchase.entity';
import { UserRepository } from '../user/user.repository';
import { PaymentModule } from '../payment/payment.module';
import { ProductOptionRepository } from '../product-option/product-option.repository';
import { FileUploadRepository } from '../file-upload/file-upload.repository';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { PurchaseUtils } from 'src/core/purchase/purchase.utils';

@Module({
  imports: [
    PromoCodeModule,
    PatternProductModule,
    MasterClassModule,
    SewingProductModule,
    PurchaseProductModule,
    MailModule,
    SdekModule,
    FileUploadModule,
    PaymentModule,
    TypeOrmModule.forFeature([
      PurchaseEntity,
      PurchaseRepository,
      UserRepository,
      ProductOptionRepository,
      FileUploadRepository,
    ]),
  ],
  providers: [PurchaseService, PurchaseUtils],
  controllers: [PurchaseController],
  exports: [PurchaseUtils],
})
export class PurchaseModule {}
