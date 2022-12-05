import { LikeEntity } from './like.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(LikeEntity)
export class LikeRepository extends Repository<LikeEntity> {
  async getUserLikesRu(userId: number): Promise<LikeEntity[]> {
    return await this.createQueryBuilder('like')
      .leftJoin('like.postId', 'post')
      .leftJoin('post.image', 'post_image')
      .leftJoin('post.categories', 'post_categories')
      .leftJoin('like.patternProductId', 'pattern_product')
      .leftJoin('pattern_product.images', 'pattern_product_images')
      .leftJoin('pattern_product.sizes', 'pattern_product_sizes')
      .leftJoin('pattern_product.categories', 'pattern_product_categories')
      .leftJoin('like.masterClassId', 'master_class')
      .leftJoin('master_class.images', 'master_class_images')
      .leftJoin('master_class.categories', 'master_class_categories')
      .leftJoin('master_class.programs', 'master_class_programs')
      .leftJoin('like.sewingProductId', 'sewing_product')
      .leftJoin('sewing_product.images', 'sewing_product_images')
      .leftJoin('sewing_product.categories', 'sewing_product_categories')
      .leftJoin('sewing_product.sizes', 'sewing_product_sizes')
      .select([
        'like',
        'post.id',
        'post.titleRu',
        'post.createdDate',
        'post.likeCount',
        'post.modifier',
        'post.type',
        'post_image',
        'post_categories',

        'master_class.id',
        'master_class.titleRu',
        'master_class.modifier',
        'master_class.discount',
        'master_class.type',
        'master_class_images',
        'master_class_categories',
        'master_class_programs.id',
        'master_class_programs.price',

        'pattern_product.id',
        'pattern_product.titleRu',
        'pattern_product.type',
        'pattern_product.modifier',
        'pattern_product.complexity',
        'pattern_product.discount',
        'pattern_product_images',
        'pattern_product_categories',
        'pattern_product_sizes.id',
        'pattern_product_sizes.price',

        'sewing_product.id',
        'sewing_product.titleRu',
        'sewing_product.discount',
        'sewing_product.modifier',
        'sewing_product.type',
        'sewing_product_images',
        'sewing_product_categories',
        'sewing_product_sizes.id',
        'sewing_product_sizes.price',
      ])
      .where('like.userId = :userId', { userId })
      .where('sewing_product.deleted = false')
      .where('sewing_product.deleted = false')
      .where('pattern_product.deleted = false')
      .where('master_class.deleted = false')
      .getMany();
  }

  async getUserLikesEn(userId: number): Promise<LikeEntity[]> {
    return await this.createQueryBuilder('like')
      .leftJoin('like.postId', 'post')
      .leftJoin('post.image', 'post_image')
      .leftJoin('post.categories', 'post_categories')
      .leftJoin('like.patternProductId', 'pattern_product')
      .leftJoin('pattern_product.images', 'pattern_product_images')
      .leftJoin('pattern_product.sizes', 'pattern_product_sizes')
      .leftJoin('pattern_product.categories', 'pattern_product_categories')
      .leftJoin('like.masterClassId', 'master_class')
      .leftJoin('master_class.images', 'master_class_images')
      .leftJoin('master_class.categories', 'master_class_categories')
      .leftJoin('master_class.programs', 'master_class_programs')
      .leftJoin('like.sewingProductId', 'sewing_product')
      .leftJoin('sewing_product.images', 'sewing_product_images')
      .leftJoin('sewing_product.categories', 'sewing_product_categories')
      .leftJoin('sewing_product.sizes', 'sewing_product_sizes')
      .select([
        'like',
        'post.id',
        'post.titleEn',
        'post.createdDate',
        'post.likeCount',
        'post.modifier',
        'post.type',
        'post_image',
        'post_categories',

        'master_class.id',
        'master_class.titleEn',
        'master_class.modifier',
        'master_class.discount',
        'master_class.type',
        'master_class_images',
        'master_class_categories',
        'master_class_programs.id',
        'master_class_programs.price',

        'pattern_product.id',
        'pattern_product.titleEn',
        'pattern_product.type',
        'pattern_product.modifier',
        'pattern_product.complexity',
        'pattern_product.discount',
        'pattern_product_images',
        'pattern_product_categories',
        'pattern_product_sizes.id',
        'pattern_product_sizes.price',

        'sewing_product.id',
        'sewing_product.titleEn',
        'sewing_product.discount',
        'sewing_product.modifier',
        'sewing_product.type',
        'sewing_product_images',
        'sewing_product_categories',
        'sewing_product_sizes.id',
        'sewing_product_sizes.price',
      ])
      .where('like.userId = :userId', { userId })
      .where('sewing_product.deleted = false')
      .where('sewing_product.deleted = false')
      .where('pattern_product.deleted = false')
      .where('master_class.deleted = false')
      .getMany();
  }
}
