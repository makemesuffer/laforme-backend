import { CommentRepository } from '../comment.repository';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { COMMENT_ERROR } from '../enum/comment.enum';

@Injectable()
export class CommentGuard implements CanActivate {
  constructor(private commentRepository: CommentRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;

    if (!params.commentId) {
      throw new BadRequestException();
    }

    const comment = await this.commentRepository.findOne({
      where: { id: params.commentId },
    });

    if (!comment) {
      throw new BadRequestException(COMMENT_ERROR.COMMENT_NOT_FOUND);
    }

    request.comment = comment;
    return true;
  }
}
