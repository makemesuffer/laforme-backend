import { createParamDecorator } from '@nestjs/common';
import { CommentEntity } from '../comment.entity';

export const GetComment = createParamDecorator((data: string, ctx) => {
  const comment: CommentEntity = ctx.switchToHttp().getRequest().comment;
  return data ? comment && comment[data] : comment;
});
