import { FileUploadModule } from '../file-upload/file-upload.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOptionRepository } from './product-option.repository';
import { ProductOptionService } from './product-option.service';
import { ProductOptionController } from './product-option.controller';
import { ProductOptionEntity } from './product-option.entity';

@Module({
  imports: [
    FileUploadModule,
    TypeOrmModule.forFeature([ProductOptionRepository, ProductOptionEntity]),
  ],
  providers: [ProductOptionService],
  exports: [ProductOptionService],
  controllers: [ProductOptionController],
})
export class ProductOptionModule {}
