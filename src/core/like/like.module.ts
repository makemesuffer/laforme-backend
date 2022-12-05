import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { LikeRepository } from './like.repository';
import { LikeEntity } from './like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LikeRepository, LikeEntity])],
  providers: [LikeService],
  exports: [LikeService],
  controllers: [LikeController],
})
export class LikeModule {}
