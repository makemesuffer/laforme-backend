import { PostEntity } from './post.entity';
import { EntityRepository, Repository } from 'typeorm';
import { recommendations } from '../recommendation/recommendation.select';
import {
  findAllPostParamsDto,
  findOnePostParamsDto,
} from './dto/post-find-params.dto';

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
  async findAll(params: findAllPostParamsDto): Promise<[PostEntity[], number]> {
    const { take, skip, sort, by, where, category, lang, userId } = params;

    const query = await this.createQueryBuilder('post')
      .leftJoin('post.image', 'image')
      .leftJoin('post.categories', 'categories')
      .select([
        'post.id',
        'post.type',
        'post.titleRu',
        'post.modifierRu',
        'post.createdDate',
        'post.vendorCode',
        'post.deleted',
        'post.clickCount',
        'post.inEnglish',
        'image',
        'categories.id',
        'categories.categoryNameRu',
      ])
      .take(take)
      .skip(skip)
      .orderBy(sort, by)

      .where('post.deleted = false')
      .andWhere('post.inEnglish = :lang', { lang: lang === 'en' });

    if (where) {
      query.andWhere('LOWER(post.titleRu) ILIKE :search', {
        search: `%${where.toLowerCase()}%`,
      });
    }

    if (category) {
      query.andWhere('categories.categoryNameRu = :category', {
        category: category,
      });
    }

    if (userId) {
      query.leftJoinAndSelect('post.like', 'like', 'like.userId = :userId', {
        userId,
      });
    }
    return await query.getManyAndCount();
  }

  async findLiked(
    params: findAllPostParamsDto,
  ): Promise<[PostEntity[], number]> {
    const { take, skip, sort, by, where, category, lang, userId } = params;

    const query = await this.createQueryBuilder('post')
      .leftJoin('post.image', 'image')
      .leftJoin('post.categories', 'categories')
      .leftJoin('post.like', 'like', 'like.userId = :userId', {
        userId,
      })
      .select([
        'post.id',
        'post.type',
        'post.titleRu',
        'post.modifierRu',
        'post.createdDate',
        'post.vendorCode',
        'post.deleted',
        'post.inEnglish',
        'post.clickCount',
        'image',
        'categories.id',
        'categories.categoryNameRu',
        'like',
      ])
      .take(take)
      .skip(skip)
      .orderBy(sort, by)

      .where('post.deleted = false')
      .andWhere('post.inEnglish = :lang', { lang: lang === 'en' })
      .andWhere('like.userId = :userId', { userId });

    if (where) {
      query.andWhere('post.titleRu ILIKE :search', {
        search: `%${where}%`,
      });
    }

    if (category) {
      query.andWhere('categories.categoryNameRu = :category', {
        category: category,
      });
    }

    return await query.getManyAndCount();
  }

  async findAllForAdmin(
    params: findAllPostParamsDto,
  ): Promise<[PostEntity[], number]> {
    const { take, skip, sort, by, where, category, lang } = params;
    const query = await this.createQueryBuilder('post')
      .leftJoin('post.image', 'image')
      .leftJoin('post.categories', 'categories')
      .select([
        'post.id',
        'post.type',
        'post.titleRu',
        'post.modifierRu',
        'post.createdDate',
        'post.vendorCode',
        'post.clickCount',
        'post.deleted',
        'post.inEnglish',
        'image',
        'categories.id',
        'categories.categoryNameRu',
      ])
      .orderBy(sort, by)
      .take(take)
      .skip(skip)

      .where('post.inEnglish = :lang', { lang: lang === 'en' });

    if (where) {
      query.andWhere('post.titleRu ILIKE :search', {
        search: `%${where}%`,
      });
    }

    if (category) {
      query.andWhere('categories.categoryNameRu = :category', {
        category: category,
      });
    }

    return await query.getManyAndCount();
  }

  async findOneProduct(params: findOnePostParamsDto): Promise<PostEntity> {
    const { id, userId } = params;
    const query = await this.createQueryBuilder('post')
      .leftJoin('post.image', 'image')
      .leftJoin('post.categories', 'categories')
      .leftJoin('post.recommendation', 'recommendation')
      .leftJoin('recommendation.recommendationProducts', 'recommendations')

      .leftJoin('recommendations.masterClassId', 'rec_master_class')
      .leftJoin('recommendations.postId', 'rec_post')
      .leftJoin('recommendations.patternProductId', 'rec_pattern_product')
      .leftJoin('recommendations.sewingProductId', 'rec_sewing_product')

      .leftJoin('rec_master_class.images', 'rec_master_class_images')
      .leftJoin('rec_pattern_product.images', 'rec_pattern_product_images')
      .leftJoin('rec_sewing_product.images', 'rec_sewing_product_images')
      .leftJoin('rec_post.image', 'rec_post_image')

      .leftJoin('rec_pattern_product.options', 'rec_pattern_product_options')
      .leftJoin('rec_sewing_product.options', 'rec_sewing_product_options')

      .select(
        [
          'post.id',
          'post.type',
          'post.titleRu',
          'post.modifierRu',
          'post.articleRu',
          'post.createdDate',
          'post.vendorCode',
          'post.deleted',
          'post.inEnglish',
          'post.clickCount',
          'image',
          'categories.id',
          'categories.categoryNameRu',
        ].concat(recommendations),
      )
      .where('post.id = :id', { id })
      .andWhere('post.deleted = false');
    //   .andWhere(
    //     new Brackets((qb) => {
    //       qb.where('rec_sewing_product.deleted = false')
    //         .orWhere('rec_master_class.deleted = false ')
    //         .orWhere('rec_pattern_product.deleted = false ')
    //         .orWhere('rec_post.deleted = false ');
    //     }),
    //   )
    //   .andWhere(
    //     new Brackets((qb) => {
    //       qb.where('rec_sewing_product.optionType = 0')
    //         .orWhere('rec_sewing_product_options.optionVisibility = true')
    //         .orWhere('rec_pattern_product.optionType = 0')
    //         .orWhere('rec_pattern_product_options.optionVisibility = true')
    //         .orWhere('rec_master_class.deleted = false')
    //         .orWhere('rec_post.deleted = false');
    //     }),
    //   );

    if (userId) {
      query
        .leftJoinAndSelect('post.like', 'like', 'like.userId = :userId', {
          userId,
        })
        .leftJoinAndSelect(
          'rec_master_class.like',
          'rec_master_class_like',
          'rec_master_class_like.userId = :userId',
          {
            userId,
          },
        )
        .leftJoinAndSelect(
          'rec_pattern_product.like',
          'rec_pattern_product_like',
          'rec_pattern_product_like.userId = :userId',
          {
            userId,
          },
        )
        .leftJoinAndSelect(
          'rec_sewing_product.like',
          'rec_sewing_product_like',
          'rec_sewing_product_like.userId = :userId',
          {
            userId,
          },
        )
        .leftJoinAndSelect(
          'rec_post.like',
          'rec_post_like',
          'rec_post_like.userId = :userId',
          {
            userId,
          },
        );
    }

    return await query.getOne();
  }

  async findOneForAdmin(id: string): Promise<PostEntity> {
    return await this.createQueryBuilder('post')
      .leftJoin('post.image', 'image')
      .leftJoin('post.categories', 'categories')
      .leftJoin('post.recommendation', 'recommendation')
      .leftJoin('recommendation.recommendationProducts', 'recommendations')

      .leftJoin('recommendations.masterClassId', 'rec_master_class')
      .leftJoin('recommendations.postId', 'rec_post')
      .leftJoin('recommendations.patternProductId', 'rec_pattern_product')
      .leftJoin('recommendations.sewingProductId', 'rec_sewing_product')

      .leftJoin('rec_master_class.images', 'rec_master_class_images')
      .leftJoin('rec_pattern_product.images', 'rec_pattern_product_images')
      .leftJoin('rec_sewing_product.images', 'rec_sewing_product_images')
      .leftJoin('rec_post.image', 'rec_post_image')

      .leftJoin('rec_pattern_product.options', 'rec_pattern_product_options')
      .leftJoin('rec_sewing_product.options', 'rec_sewing_product_options')

      .select(
        [
          'post.id',
          'post.vendorCode',
          'post.createdDate',
          'post.type',
          'post.titleRu',
          'post.modifierRu',
          'post.articleRu',
          'post.deleted',
          'post.inEnglish',
          'post.clickCount',
          'image',
          'categories.id',
          'categories.categoryNameRu',
        ].concat(recommendations),
      )
      .where('post.id = :id', { id })
      .getOne();
  }
}
