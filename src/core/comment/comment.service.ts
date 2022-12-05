import { CommentRepository, SubCommentRepository } from './comment.repository';
import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CommentDto } from './dto/comment.dto';
import { CommentEntity, SubCommentEntity } from './comment.entity';
import { COMMENT_ERROR } from './enum/comment.enum';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { SubCommentDto } from './dto/sub-comment.dto';
import { UserEntity } from '../user/user.entity';
import { USER_ROLE } from '../user/enum/user-role.enum';

@Injectable()
export class CommentService {
  constructor(
    private commentRepository: CommentRepository,
    private subCommentRepository: SubCommentRepository,
  ) {}

  async create(body: CommentDto, userId): Promise<CommentEntity> {
    const result = await this.commentRepository.save({ ...body, userId });
    return await this.commentRepository.findOneComment(result.id);
  }

  async delete(id: string, user: UserEntity) {
    if (user.role >= USER_ROLE.ADMIN) {
      return await this.commentRepository.delete(id);
    }

    const result = await this.commentRepository.findOne({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!result) {
      throw new BadRequestException(COMMENT_ERROR.COMMENT_NOT_FOUND);
    } else return await this.commentRepository.delete(id);
  }

  async createSub(body: SubCommentDto, userId): Promise<SubCommentEntity> {
    const result = await this.subCommentRepository.save({ ...body, userId });
    return await this.subCommentRepository.findOneSubComment(result.id);
  }

  async deleteSub(id: string, user: UserEntity) {
    if (user.role >= USER_ROLE.ADMIN) {
      return await this.subCommentRepository.delete(id);
    }

    const result = await this.subCommentRepository.findOne({
      where: {
        id: id,
        userId: user.id,
      },
    });
    if (!result) {
      throw new BadRequestException(COMMENT_ERROR.COMMENT_NOT_FOUND);
    } else return await this.subCommentRepository.delete(id);
  }

  async getMasterClassComment(id: string) {
    return await this.commentRepository.findMasterClassComment(id);
  }
  async getPatternProductComment(id: string) {
    return await this.commentRepository.findPatternProductComment(id);
  }
  async getPostComment(postId: string) {
    return await this.commentRepository.findPostComment(postId);
  }
  async getSewingProductComment(sewingProductId: string) {
    return await this.commentRepository.findSewingProductComment(
      sewingProductId,
    );
  }

  async update(
    user: UserEntity,
    comment: CommentEntity,
    body: UpdateCommentDto,
  ) {
    if (user.role >= USER_ROLE.ADMIN) {
      comment.text = body.text;
      return await comment.save();
    }

    const result = await this.commentRepository.findOne({
      where: {
        id: comment.id,
        userId: user,
      },
    });
    if (!result) {
      throw new BadRequestException(COMMENT_ERROR.COMMENT_NOT_FOUND);
    } else await this.commentRepository.update(comment.id, { text: body.text });
    return await this.commentRepository.findOne(comment.id);
  }

  async updateSub(
    user: UserEntity,
    subComment: SubCommentEntity,
    body: UpdateCommentDto,
  ) {
    if (user.role >= USER_ROLE.ADMIN) {
      subComment.text = body.text;
      return await subComment.save();
    }
    const result = await this.subCommentRepository.findOne({
      where: {
        id: subComment.id,
        userId: user,
      },
    });
    if (!result) {
      throw new BadRequestException(COMMENT_ERROR.COMMENT_NOT_FOUND);
    } else
      await this.subCommentRepository.update(subComment.id, {
        text: body.text,
      });
    return await this.subCommentRepository.findOne(subComment.id, {
      relations: ['commentId'],
    });
  }

  async getAllSubs(postId: string, commentId: string) {
    return await this.subCommentRepository.findAll(postId, commentId);
  }

  async getAllUserComments(userId): Promise<CommentEntity[]> {
    return await this.commentRepository.findAllUserComments(userId);
  }

  async getAllUserCommentsForAdmin(
    skip: number,
    take: number,
  ): Promise<[CommentEntity[], number]> {
    return await this.commentRepository.findAllUserCommentsForAdmin(skip, take);
  }

  async getOne(id: string) {
    const result = await this.commentRepository.findOneComment(id);
    const sub = await this.subCommentRepository.findAllToOneComment(id);
    result.subComment = sub;
    if (!result) {
      throw new BadRequestException(COMMENT_ERROR.COMMENT_NOT_FOUND);
    } else return result;
  }
}
