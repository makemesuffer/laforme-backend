import { PostRepository } from '../post.repository';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { POST_ERROR } from '../enum/post.enum';

@Injectable()
export class PostGuard implements CanActivate {
  constructor(private postRepository: PostRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;

    if (!params.postId) {
      throw new BadRequestException();
    }

    const post = await this.postRepository.findOne({
      where: { id: params.postId },
    });

    if (!post) {
      throw new BadRequestException(POST_ERROR.POST_NOT_FOUND);
    }
    return true;
  }
}
