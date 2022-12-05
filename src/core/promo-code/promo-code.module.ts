import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromoCodeController } from './promo-code.controller';
import { PromoCodeService } from './promo-code.service';
import { PromoCodeEntity } from './promo-code.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([PromoCodeEntity]),
  ],
  providers: [PromoCodeService],
  exports: [PromoCodeService],
  controllers: [PromoCodeController],
})
export class PromoCodeModule {}
