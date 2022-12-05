import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompilationController } from './compilation.controller';
import { CompilationEntity } from './compilation.entity';
import { CompilationRepository } from './compilation.repository';
import { CompilationService } from './compilation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompilationRepository, CompilationEntity]),
  ],
  providers: [CompilationService],
  exports: [CompilationService],
  controllers: [CompilationController],
})
export class CompilationModule {}
