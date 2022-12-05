import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqRepository } from './faq.repository';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { FaqEntity } from './faq.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FaqRepository, FaqEntity])],
  providers: [FaqService],
  exports: [FaqService],
  controllers: [FaqController],
})
export class FaqModule {}
