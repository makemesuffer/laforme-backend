import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentRepository, SubCommentRepository } from './comment.repository';
import { CommentEntity, SubCommentEntity } from './comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentRepository,
      SubCommentRepository,
      CommentEntity,
      SubCommentEntity,
    ]),
  ],
  providers: [CommentService],
  exports: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
