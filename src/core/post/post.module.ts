import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { PostEntity } from './post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostRepository, PostEntity])],
  providers: [PostService],
  exports: [PostService],
  controllers: [PostController],
})
export class PostModule {}
