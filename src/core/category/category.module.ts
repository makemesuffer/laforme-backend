import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';
import { CategoryEntity } from './category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryRepository, CategoryEntity])],
  providers: [CategoryService],
  exports: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
