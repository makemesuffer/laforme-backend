import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FooterRepository } from './footer.repository';
import { FooterService } from './footer.service';
import { FooterController } from './footer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FooterRepository])],
  providers: [FooterService],
  exports: [FooterService],
  controllers: [FooterController],
})
export class FooterModule {}
