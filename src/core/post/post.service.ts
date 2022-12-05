import { PostEntity } from './post.entity';
import { Injectable } from '@nestjs/common';
import { PostDto } from './dto/post.dto';
import { PostRepository } from './post.repository';
import {
  findAllPostParamsDto,
  findOnePostParamsDto,
} from './dto/post-find-params.dto';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  async getAll(params: findAllPostParamsDto): Promise<[PostEntity[], number]> {
    if (params.sort === 'title') {
      params.sort = 'post.titleRu';
    } else if (params.sort === 'date') {
      params.sort = 'post.createdDate';
    } else {
      params.sort = '';
    }

    if (params.getAll) {
      return await this.postRepository.findAllForAdmin(params);
    }
    return await this.postRepository.findAll(params);
  }

  async getLiked(
    params: findAllPostParamsDto,
  ): Promise<[PostEntity[], number]> {
    if (params.sort === 'title') {
      params.sort = 'post.titleRu';
    } else if (params.sort === 'date') {
      params.sort = 'post.createdDate';
    } else {
      params.sort = '';
    }
    return await this.postRepository.findLiked(params);
  }

  async getOne(params: findOnePostParamsDto): Promise<PostEntity> {
    return await this.postRepository.findOneProduct(params);
  }
  async getOneForAdmin(id: string): Promise<PostEntity> {
    return await this.postRepository.findOneForAdmin(id);
  }

  async create(body: PostDto): Promise<PostEntity> {
    if (!Boolean(body.vendorCode)) {
      body.vendorCode = PostEntity.getVendorCode();
    }
    return await this.postRepository.save(body);
  }
  async update(id: string, body: PostDto) {
    body.id = id;
    if (!Boolean(body.vendorCode)) {
      body.vendorCode = PostEntity.getVendorCode();
    }
    return await this.postRepository.save(body);
  }
  async delete(id: string) {
    const post = await this.postRepository.findOneOrFail(id);
    return await this.postRepository.delete(post.id);
  }
  async disable(id: string, deleted: boolean) {
    await this.postRepository.update({ id }, { deleted });
  }
}
