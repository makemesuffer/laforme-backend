import { MasterClassModule } from './core/master-class/master-class.module';
import { LikeModule } from './core/like/like.module';
import { SliderModule } from './core/slider/slider.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './core/auth/auth.module';
import { UserSettingsModule } from './core/user-settings/user-settings.module';
import { UserRecoveryModule } from './core/user-recovery/user-recovery.module';
import { UserModule } from './core/user/user.module';
import { FileUploadModule } from './core/file-upload/file-upload.module';
import { CategoryModule } from './core/category/category.module';
import { PostModule } from './core/post/post.module';
import { PurchaseModule } from './core/purchase/purchase.module';
import { SewingProductModule } from './core/sewing-product/sewing-product.module';
import { PatternProductModule } from './core/pattern-product/pattern-product.module';
import { PromoCodeModule } from './core/promo-code/promo-code.module';
import { MailModule } from './core/mail/mail.module';
import { ProductOptionModule } from './core/product-option/product-option.module';
import { CommentModule } from './core/comment/comment.module';
import { FaqModule } from './core/faq/faq.module';
import { StatisticsModule } from './core/statistics/statistics.module';
import { PaymentModule } from './core/payment/payment.module';
import { CompilationModule } from './core/compilation/compilation.module';
import { SdekModule } from './core/sdek/sdek.module';
import { PageNavigationModule } from './core/page-navigation/page-navigation.module';
import { FooterModule } from './core/footer/footer.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  providers: [],
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    ProductOptionModule,
    UserSettingsModule,
    UserRecoveryModule,
    UserModule,
    FileUploadModule,
    CategoryModule,
    PostModule,
    LikeModule,
    SliderModule,
    MasterClassModule,
    PurchaseModule,
    SewingProductModule,
    PatternProductModule,
    PromoCodeModule,
    MailModule,
    CommentModule,
    FaqModule,
    StatisticsModule,
    PaymentModule,
    CompilationModule,
    SdekModule,
    PageNavigationModule,
    FooterModule,
    EventEmitterModule.forRoot(),
  ],
})
export class AppModule {}
