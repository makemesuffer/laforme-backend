import { LikeRepository } from './like.repository';
import { Injectable, BadRequestException } from '@nestjs/common';
import { LIKE_ERROR } from './enum/like.enum';
import { LikeDto } from './dto/like.dto';
import { LikeEntity } from './like.entity';

@Injectable()
export class LikeService {
  constructor(private likeRepository: LikeRepository) {}

  async create(body: LikeDto, userId) {
    const result = await this.likeRepository.findOne({
      ...body,
      userId: userId,
    });
    if (result) {
      throw new BadRequestException(LIKE_ERROR.LIKE_ALREADY_EXISTS);
    } else await this.likeRepository.save({ ...body, userId: userId });

    if (body.postId) {
      return { id: body.postId };
    }
    if (body.masterClassId) {
      return { id: body.masterClassId };
    }
    if (body.sewingProductId) {
      return { id: body.sewingProductId };
    }
    if (body.patternProductId) {
      return { id: body.patternProductId };
    }
  }

  async getUserLikes(userId: number, query: string): Promise<LikeEntity[]> {
    if (query === 'ru') return await this.likeRepository.getUserLikesRu(userId);
    if (query === 'en') return await this.likeRepository.getUserLikesEn(userId);
  }

  async delete(body: LikeDto, userId) {
    const result = await this.likeRepository.findOne({
      ...body,
      userId: userId,
    });
    if (!result) {
      throw new BadRequestException(LIKE_ERROR.LIKE_NOT_EXISTS);
    } else await this.likeRepository.delete(result.id);

    if (body.postId) {
      return { id: body.postId };
    }
    if (body.masterClassId) {
      return { id: body.masterClassId };
    }
    if (body.sewingProductId) {
      return { id: body.sewingProductId };
    }
    if (body.patternProductId) {
      return { id: body.patternProductId };
    }
  }

  async count(body) {
    return await this.likeRepository.count(body);
  }
}
