import { PatternProductEntity } from './pattern-product.entity';
import { Brackets, EntityRepository, Repository } from 'typeorm';
import { recommendations } from '../recommendation/recommendation.select';
import {
  findAllPatternParamsDto,
  findOnePatternParamsDto,
} from './dto/pattern-find-params.dto';

@EntityRepository(PatternProductEntity)
export class PatternProductRepository extends Repository<PatternProductEntity> {
  async findAll(
    params: findAllPatternParamsDto,
  ): Promise<[PatternProductEntity[], number]> {
    const { take, skip, sort, by, where, category, lang, userId, type } =
      params;

    const query = await this.createQueryBuilder('pattern_product')
      .leftJoin('pattern_product.images', 'images')
      .leftJoin('pattern_product.categories', 'categories')
      .leftJoin('pattern_product.options', 'options')
      .select([
        'pattern_product.id',
        'pattern_product.type',
        'pattern_product.optionType',
        'pattern_product.titleRu',
        'pattern_product.modifierRu',
        'pattern_product.complexity',
        'pattern_product.vendorCode',
        'pattern_product.price',
        'pattern_product.discount',
        'pattern_product.count',
        'pattern_product.isCount',
        'pattern_product.createdDate',
        'pattern_product.deleted',
        'pattern_product.inEnglish',
        'pattern_product.clickCount',
        'images',
        'categories.id',
        'categories.categoryNameRu',
        'options.id',
        'options.price',
        'options.discount',
        'options.size',
        'options.count',
        'options.vendorCode',
        'options.optionVisibility',
      ])
      .orderBy(sort, by)
      .take(take)
      .skip(skip)

      .where('pattern_product.deleted = false')
      .andWhere('pattern_product.inEnglish = :lang', { lang: lang === 'en' })
      .andWhere(
        new Brackets((qb) => {
          qb.where('pattern_product.optionType = 0').orWhere(
            'options.optionVisibility = true',
          );
        }),
      );

    if (where) {
      query.andWhere('pattern_product.titleRu ILIKE :search', {
        search: `%${where}%`,
      });
    }

    if (type) {
      query.andWhere('pattern_product.type = :type', {
        type: type,
      });
    }

    if (category) {
      query.andWhere('categories.categoryNameRu = :category', {
        category: category,
      });
    }

    if (userId) {
      query.leftJoinAndSelect(
        'pattern_product.like',
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
    params: findAllPatternParamsDto,
  ): Promise<[PatternProductEntity[], number]> {
    const { take, skip, sort, by, where, category, lang, userId, type } =
      params;

    const query = await this.createQueryBuilder('pattern_product')
      .leftJoin('pattern_product.images', 'images')
      .leftJoin('pattern_product.categories', 'categories')
      .leftJoin('pattern_product.options', 'options')
      .leftJoin('pattern_product.like', 'like', 'like.userId = :userId', {
        userId,
      })
      .select([
        'pattern_product.id',
        'pattern_product.type',
        'pattern_product.optionType',
        'pattern_product.titleRu',
        'pattern_product.modifierRu',
        'pattern_product.createdDate',
        'pattern_product.complexity',
        'pattern_product.vendorCode',
        'pattern_product.price',
        'pattern_product.discount',
        'pattern_product.count',
        'pattern_product.isCount',
        'pattern_product.deleted',
        'pattern_product.inEnglish',
        'pattern_product.clickCount',
        'images',
        'categories.id',
        'categories.categoryNameRu',
        'options.id',
        'options.price',
        'options.discount',
        'options.size',
        'options.count',
        'options.vendorCode',
        'options.optionVisibility',
        'like',
      ])
      .take(take)
      .skip(skip)
      .orderBy(sort, by)

      .where('pattern_product.deleted = false')
      .andWhere('pattern_product.inEnglish = :lang', { lang: lang === 'en' })
      .andWhere('like.userId = :userId', { userId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('pattern_product.optionType = 0').orWhere(
            'options.optionVisibility = true',
          );
        }),
      );

    if (where) {
      query.andWhere('LOWER(pattern_product.titleRu) ILIKE :search', {
        search: `%${where.toLocaleLowerCase()}%`,
      });
    }

    if (type) {
      query.andWhere('pattern_product.type = :type', {
        type: type,
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
    params: findAllPatternParamsDto,
  ): Promise<[PatternProductEntity[], number]> {
    const { take, skip, sort, by, where, category, lang, type } = params;

    const query = await this.createQueryBuilder('pattern_product')
      .leftJoin('pattern_product.images', 'images')
      .leftJoin('pattern_product.categories', 'categories')
      .leftJoin('pattern_product.options', 'options')
      .select([
        'pattern_product.id',
        'pattern_product.type',
        'pattern_product.optionType',
        'pattern_product.titleRu',
        'pattern_product.modifierRu',
        'pattern_product.complexity',
        'pattern_product.vendorCode',
        'pattern_product.price',
        'pattern_product.discount',
        'pattern_product.count',
        'pattern_product.isCount',
        'pattern_product.createdDate',
        'pattern_product.deleted',
        'pattern_product.inEnglish',
        'pattern_product.clickCount',
        'images',
        'categories.id',
        'categories.categoryNameRu',
        'options.id',
        'options.price',
        'options.discount',
        'options.size',
        'options.count',
        'options.vendorCode',
        'options.optionVisibility',
      ])
      .orderBy(sort, by)
      .take(take)
      .skip(skip)
      .where('pattern_product.inEnglish = :lang', { lang: lang === 'en' });

    if (where) {
      query.andWhere('pattern_product.titleRu ILIKE :search', {
        search: `%${where}%`,
      });
    }

    if (type) {
      query.andWhere('pattern_product.type = :type', {
        type: type,
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
    params: findOnePatternParamsDto,
  ): Promise<PatternProductEntity> {
    const { id, userId } = params;
    const query = await this.createQueryBuilder('pattern_product')
      .leftJoin('pattern_product.images', 'images')
      .leftJoin('pattern_product.categories', 'categories')
      .leftJoin('pattern_product.options', 'options')
      .leftJoin('pattern_product.recommendation', 'recommendation')
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
          'pattern_product.id',
          'pattern_product.type',
          'pattern_product.optionType',
          'pattern_product.titleRu',
          'pattern_product.modifierRu',
          'pattern_product.descriptionRu',
          'pattern_product.materialRu',
          'pattern_product.complexity',
          'pattern_product.vendorCode',
          'pattern_product.price',
          'pattern_product.discount',
          'pattern_product.count',
          'pattern_product.isCount',
          'pattern_product.materialOld',
          'pattern_product.descriptionOld',
          'pattern_product.deleted',
          'pattern_product.clickCount',
          'images',
          'categories.id',
          'categories.categoryNameRu',
          'options.id',
          'options.price',
          'options.discount',
          'options.size',
          'options.count',
          'options.vendorCode',
          'options.optionVisibility',
          'rec_sewing_product_options.optionVisibility',
          'rec_pattern_product_options.optionVisibility',
        ].concat(recommendations),
      )
      .where('pattern_product.id = :id', { id })
      .andWhere('pattern_product.deleted = false')
      // .andWhere(
      //   'rec_sewing_product_options.optionVisibility = true OR rec_pattern_product_options.optionVisibility = true',
      // )
      .andWhere(
        new Brackets((qb) => {
          qb.where('pattern_product.optionType = 0').orWhere(
            'options.optionVisibility = true',
          );
        }),
      );
    // из за этого выдаётся кривой товар
    // .andWhere(
    //   'rec_sewing_product_options.optionVisibility = true OR rec_pattern_product_options.optionVisibility = true',
    // )
    // -------------------------
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
          'pattern_product.like',
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

  async findOneForUpdate(id: string): Promise<PatternProductEntity> {
    return await this.createQueryBuilder('pattern_product')
      .leftJoin('pattern_product.images', 'images')
      .leftJoin('pattern_product.categories', 'categories')
      .leftJoin('pattern_product.filesPdf', 'pattern_product_filesPdf')
      .leftJoin('pattern_product.options', 'options')
      .leftJoin('options.filesPdf', 'options_filesPdf')
      .leftJoin('pattern_product.recommendation', 'recommendation')
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
          'pattern_product.id',
          'pattern_product.type',
          'pattern_product.optionType',
          'pattern_product.titleRu',
          'pattern_product.modifierRu',
          'pattern_product.descriptionRu',
          'pattern_product.descriptionOld',
          'pattern_product.materialRu',
          'pattern_product.materialOld',
          'pattern_product.complexity',
          'pattern_product.vendorCode',
          'pattern_product.price',
          'pattern_product.discount',
          'pattern_product.count',
          'pattern_product.isCount',
          'pattern_product_filesPdf',
          'pattern_product.deleted',
          'pattern_product.inEnglish',
          'images',
          'categories.id',
          'categories.categoryNameRu',
          'options.id',
          'options.price',
          'options.discount',
          'options.size',
          'options.count',
          'options.vendorCode',
          'options_filesPdf',
          'options.optionVisibility',
        ].concat(recommendations),
      )
      .where('pattern_product.id = :id', { id })
      .getOne();
  }

  async findOneAndOption(
    id: string,
    option: string,
  ): Promise<PatternProductEntity> {
    return await this.createQueryBuilder('pattern_product')
      .leftJoin('pattern_product.options', 'options')
      .select([
        'pattern_product.id',
        'pattern_product.titleRu',
        'pattern_product.titleEn',
        'pattern_product.price',
        'pattern_product.discount',
        'pattern_product.count',
        'pattern_product.isCount',
        'options.id',
        'options.price',
        'options.discount',
        'options.count',
      ])
      .where('pattern_product.id = :id', { id })
      .where('options.id = :id', { id: option })
      .getOne();
  }
}
