import { PostRepository } from '../post.repository';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class PostClickCountGuard implements CanActivate {
  constructor(private postRepository: PostRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;

    const post = await this.postRepository.findOne({
      where: { id: params.postId },
    });

    await this.postRepository.update(params.postId, {
      clickCount: post.clickCount + 1,
    });
    return true;
  }
}
