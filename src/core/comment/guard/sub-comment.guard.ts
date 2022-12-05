import { SubCommentRepository } from '../comment.repository';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { COMMENT_ERROR } from '../enum/comment.enum';

@Injectable()
export class SubCommentGuard implements CanActivate {
  constructor(private subCommentRepository: SubCommentRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;

    if (!params.subCommentId) {
      throw new BadRequestException();
    }

    const subComment = await this.subCommentRepository.findOne({
      where: { id: params.subCommentId },
    });

    if (!subComment) {
      throw new BadRequestException(COMMENT_ERROR.COMMENT_NOT_FOUND);
    }

    request.subComment = subComment;
    return true;
  }
}
