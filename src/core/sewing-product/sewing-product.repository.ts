import { SewingProductEntity } from './sewing-product.entity';
import { Brackets, EntityRepository, Repository } from 'typeorm';
import { recommendations } from '../recommendation/recommendation.select';
import {
  findAllSewingProductParamsDto,
  findOneSewingProductParamsDto,
} from './dto/sewing-product-find-params.dto';

@EntityRepository(SewingProductEntity)
export class SewingProductRepository extends Repository<SewingProductEntity> {
  async findAll(
    params: findAllSewingProductParamsDto,
  ): Promise<[SewingProductEntity[], number]> {
    const { skip, take, sort, by, where, category, lang, userId } = params;

    const query = await this.createQueryBuilder('sewing_product')
      .leftJoin('sewing_product.images', 'images')
      .leftJoin('sewing_product.categories', 'categories')
      .leftJoin('sewing_product.options', 'options')
      .select([
        'sewing_product.id',
        'sewing_product.titleRu',
        'sewing_product.modifierRu',
        'sewing_product.vendorCode',
        'sewing_product.type',
        'sewing_product.price',
        'sewing_product.discount',
        'sewing_product.optionType',
        'sewing_product.count',
        'sewing_product.isCount',
        'sewing_product.length',
        'sewing_product.isLength',
        'sewing_product.createdDate',
        'sewing_product.deleted',
        'sewing_product.inEnglish',
        'sewing_product.clickCount',
        'images',
        'categories.id',
        'categories.categoryNameRu',
        'options.id',
        'options.size',
        'options.colorRu',
        'options.price',
        'options.count',
        'options.length',
        'options.discount',
        'options.vendorCode',
        'options.optionVisibility',
      ])
      .orderBy(sort, by)
      .take(take)
      .skip(skip)

      .where('sewing_product.deleted = false')
      .andWhere('sewing_product.inEnglish = :lang', { lang: lang === 'en' })

      .andWhere(
        new Brackets((qb) => {
          qb.where('sewing_product.optionType = 0').orWhere(
            'options.optionVisibility = true',
          );
        }),
      );

    if (where) {
      query.andWhere('LOWER(sewing_product.titleRu) ILIKE :search', {
        search: `%${where.toLowerCase()}%`,
      });
    }

    if (category) {
      query.andWhere('categories.categoryNameRu = :category', {
        category: category,
      });
    }

    if (userId) {
      query.leftJoinAndSelect(
        'sewing_product.like',
        'like',
        'like.userId = :userId',
        {
          userId,
        },
      );
    }

    return await query.getManyAndCount();
  }

  async findLiked(
    params: findAllSewingProductParamsDto,
  ): Promise<[SewingProductEntity[], number]> {
    const { skip, take, sort, by, where, category, lang, userId } = params;

    const query = await this.createQueryBuilder('sewing_product')
      .leftJoin('sewing_product.images', 'images')
      .leftJoin('sewing_product.categories', 'categories')
      .leftJoin('sewing_product.options', 'options')
      .leftJoin('sewing_product.like', 'like')
      .select([
        'sewing_product.id',
        'sewing_product.titleRu',
        'sewing_product.modifierRu',
        'sewing_product.vendorCode',
        'sewing_product.type',
        'sewing_product.createdDate',
        'sewing_product.price',
        'sewing_product.discount',
        'sewing_product.optionType',
        'sewing_product.count',
        'sewing_product.isCount',
        'sewing_product.length',
        'sewing_product.isLength',
        'sewing_product.deleted',
        'sewing_product.inEnglish',
        'sewing_product.clickCount',
        'images',
        'categories.id',
        'categories.categoryNameRu',
        'options.id',
        'options.size',
        'options.colorRu',
        'options.price',
        'options.count',
        'options.length',
        'options.discount',
        'options.vendorCode',
        'options.optionVisibility',
        'like',
      ])
      .orderBy(sort, by)
      .take(take)
      .skip(skip)

      .where('sewing_product.deleted = false')
      .andWhere('sewing_product.inEnglish = :lang', { lang: lang === 'en' })
      .andWhere('like.userId = :userId', { userId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('sewing_product.optionType = 0').orWhere(
            'options.optionVisibility = true',
          );
        }),
      );

    if (where) {
      query.andWhere('sewing_product.titleRu ILIKE :search', {
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
    params: findAllSewingProductParamsDto,
  ): Promise<[SewingProductEntity[], number]> {
    const { skip, take, sort, by, where, category, lang } = params;

    const query = await this.createQueryBuilder('sewing_product')
      .leftJoin('sewing_product.images', 'images')
      .leftJoin('sewing_product.categories', 'categories')
      .leftJoin('sewing_product.options', 'options')
      .select([
        'sewing_product.id',
        'sewing_product.titleRu',
        'sewing_product.modifierRu',
        'sewing_product.vendorCode',
        'sewing_product.type',
        'sewing_product.price',
        'sewing_product.discount',
        'sewing_product.optionType',
        'sewing_product.count',
        'sewing_product.isCount',
        'sewing_product.length',
        'sewing_product.isLength',
        'sewing_product.createdDate',
        'sewing_product.deleted',
        'sewing_product.inEnglish',
        'sewing_product.clickCount',
        'images',
        'categories.id',
        'categories.categoryNameRu',
        'options.id',
        'options.size',
        'options.colorRu',
        'options.price',
        'options.count',
        'options.length',
        'options.discount',
        'options.vendorCode',
        'options.optionVisibility',
      ])
      .orderBy(sort, by)
      .take(take)
      .skip(skip)
      .where('sewing_product.inEnglish = :lang', { lang: lang === 'en' });

    if (where) {
      query.andWhere('sewing_product.titleRu ILIKE :search', {
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

  async findOneProduct(
    params: findOneSewingProductParamsDto,
  ): Promise<SewingProductEntity> {
    const { id, userId } = params;

    const query = await this.createQueryBuilder('sewing_product')
      .leftJoin('sewing_product.images', 'images')
      .leftJoin('sewing_product.categories', 'categories')
      .leftJoin('sewing_product.options', 'options')
      .leftJoin('sewing_product.recommendation', 'recommendation')
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
          'sewing_product.id',
          'sewing_product.type',
          'sewing_product.optionType',
          'sewing_product.titleRu',
          'sewing_product.descriptionRu',
          'sewing_product.modifierRu',
          'sewing_product.discount',
          'sewing_product.deleted',
          'sewing_product.price',
          'sewing_product.createdDate',
          'sewing_product.count',
          'sewing_product.isCount',
          'sewing_product.length',
          'sewing_product.isLength',
          'sewing_product.vendorCode',
          'sewing_product.deleted',
          'sewing_product.clickCount',
          'images',
          'categories',
          'options.id',
          'options.vendorCode',
          'options.colorRu',
          'options.size',
          'options.price',
          'options.discount',
          'options.count',
          'options.length',
          'options.optionVisibility',
          'rec_pattern_product_options.optionVisibility',
          'rec_sewing_product_options.optionVisibility',
        ].concat(recommendations),
      )
      .where('sewing_product.id = :id', { id })
      .andWhere('sewing_product.deleted = false')
      // .andWhere(
      //   'rec_sewing_product_options.optionVisibility = true OR rec_pattern_product_options.optionVisibility = true',
      // )
      .andWhere(
        new Brackets((qb) => {
          qb.where('sewing_product.optionType = 0').orWhere(
            'options.optionVisibility = true',
          );
        }),
      );
    // .andWhere(
    //   'rec_sewing_product_options.optionVisibility = true OR rec_pattern_product_options.optionVisibility = true',
    // )
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
        .leftJoinAndSelect(
          'sewing_product.like',
          'like',
          'like.userId = :userId',
          {
            userId,
          },
        )
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

  async findOneForUpdate(id: string): Promise<SewingProductEntity> {
    return await this.createQueryBuilder('sewing_product')
      .leftJoin('sewing_product.images', 'images')
      .leftJoin('sewing_product.categories', 'categories')
      .leftJoin('sewing_product.options', 'options')
      .leftJoin('sewing_product.recommendation', 'recommendation')
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
          'sewing_product.id',
          'sewing_product.createdDate',
          'sewing_product.type',
          'sewing_product.optionType',
          'sewing_product.titleRu',
          'sewing_product.descriptionRu',
          'sewing_product.modifierRu',
          'sewing_product.discount',
          'sewing_product.deleted',
          'sewing_product.price',
          'sewing_product.count',
          'sewing_product.isCount',
          'sewing_product.length',
          'sewing_product.isLength',
          'sewing_product.vendorCode',
          'sewing_product.inEnglish',
          'images',
          'categories',
          'options.id',
          'options.vendorCode',
          'options.colorRu',
          'options.size',
          'options.price',
          'options.discount',
          'options.count',
          'options.length',
          'options.optionVisibility',
        ].concat(recommendations),
      )
      .where('sewing_product.id = :id', { id })
      .getOne();
  }

  async findOneAndOption(
    id: string,
    option: string,
  ): Promise<SewingProductEntity> {
    return await this.createQueryBuilder('sewing_product')
      .leftJoin('sewing_product.options', 'options')
      .select([
        'sewing_product.id',
        'sewing_product.titleRu',
        'sewing_product.titleEn',
        'sewing_product.price',
        'sewing_product.discount',
        'sewing_product.count',
        'sewing_product.isCount',
        'sewing_product.length',
        'sewing_product.isLength',
        'options.id',
        'options.price',
        'options.discount',
        'options.count',
        'options.length',
      ])
      .where('sewing_product.id = :id', { id })
      .where('options.id = :id', { id: option })
      .getOne();
  }
}
