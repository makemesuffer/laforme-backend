import { createParamDecorator } from '@nestjs/common';
import { SubCommentEntity } from '../comment.entity';

export const GetSubComment = createParamDecorator((data: string, ctx) => {
  const subComment: SubCommentEntity = ctx
    .switchToHttp()
    .getRequest().subComment;
  return data ? subComment && subComment[data] : subComment;
});
