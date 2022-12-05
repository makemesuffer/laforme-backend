import { MasterClassEntity } from './master-class.entity';
import { EntityRepository, Repository } from 'typeorm';
import { recommendations } from '../recommendation/recommendation.select';
import {
  findAllMasterClassParamsDto,
  findOneMasterClassParamsDto,
} from './dto/master-class-find-params.dto';
import { PurchaseEntity } from '../purchase/purchase.entity';
import { PURCHASE_STATUS } from '../purchase/enum/purchase.status';

@EntityRepository(MasterClassEntity)
export class MasterClassRepository extends Repository<MasterClassEntity> {
  async findAll(
    params: findAllMasterClassParamsDto,
  ): Promise<any | [MasterClassEntity[], number]> {
    const { take, skip, sort, by, where, category, lang, userId } = params;
    const query = await this.createQueryBuilder('master_class')
      .select([
        'master_class.id',
        'master_class.type',
        'master_class.vendorCode',
        'master_class.createdDate',
        'master_class.titleRu',
        'master_class.modifierRu',
        'master_class.discount',
        'master_class.price',
        'master_class.deleted',
        'master_class.inEnglish',
        'master_class.clickCount',
        'images',
        'categories.id',
        'categories.categoryNameRu',
      ])

      .addSelect((subQuery) => {
        return subQuery
          .from(PurchaseEntity, 'purchase')
          .leftJoin(
            'purchase.purchaseProducts',
            'purchaseProducts',
            'purchaseProducts.expiredDate >= :now',
            {
              now: new Date(),
            },
          )
          .leftJoin('purchaseProducts.masterClassId', 'masterClassId')
          .leftJoin('purchase.userId', 'userId')
          .where('masterClassId.id = master_class.id')
          .andWhere('userId.id = :userId', {
            userId,
          })
          .andWhere('purchase.orderStatus = :orderStatus', {
            orderStatus: PURCHASE_STATUS.PAID,
          })
          .select('purchaseProducts.id', 'isPurchased')
          .limit(1);
      }, 'isPurchased')

      .leftJoin('master_class.images', 'images')
      .leftJoin('master_class.categories', 'categories')
      .orderBy(sort, by)
      .take(take)
      .skip(skip)

      .where('master_class.deleted = false')
      .andWhere('master_class.inEnglish = :lang', { lang: lang === 'en' });

    if (where) {
      query.andWhere('LOWER(master_class.titleRu) ILIKE :search', {
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
        'master_class.like',
        'like',
        'like.userId = :userId',
        {
          userId,
        },
      );
    }
    const { raw, entities } = await query.getRawAndEntities();

    return [
      entities.map((item: any, index) => {
        item.isPurchased = raw[index].isPurchased;
        return item;
      }),
      entities.length,
    ];
  }

  async findOneProduct(
    params: findOneMasterClassParamsDto,
  ): Promise<any | MasterClassEntity> {
    const { id, userId } = params;
    const query = await this.createQueryBuilder('master_class')
      .select([
        'master_class.id',
        'master_class.type',
        'master_class.vendorCode',
        'master_class.createdDate',
        'master_class.titleRu',
        'master_class.modifierRu',
        'master_class.descriptionRu',
        'master_class.materialRu',
        'master_class.discount',
        'master_class.price',
        'master_class.deleted',
        'images',
        'categories.id',
        'categories.categoryNameRu',
      ])
      .addSelect(recommendations)
      .addSelect((subQuery) => {
        return subQuery
          .from(PurchaseEntity, 'purchase')
          .leftJoin(
            'purchase.purchaseProducts',
            'purchaseProducts',
            'purchaseProducts.expiredDate >= :now',
            {
              now: new Date(),
            },
          )
          .leftJoin('purchaseProducts.masterClassId', 'masterClassId')
          .leftJoin('purchase.userId', 'userId')
          .where('masterClassId.id = master_class.id')
          .andWhere('userId.id = :userId', {
            userId,
          })
          .andWhere('purchase.orderStatus = :orderStatus', {
            orderStatus: PURCHASE_STATUS.PAID,
          })
          .select('purchaseProducts.id', 'isPurchased')
          .limit(1);
      }, 'isPurchased')
      .leftJoin('master_class.images', 'images')
      .leftJoin('master_class.categories', 'categories')
      .leftJoin('master_class.recommendation', 'recommendation')
      .leftJoin('recommendation.recommendationProducts', 'recommendations')
      .leftJoinAndSelect('recommendations.masterClassId', 'rec_master_class')
      .leftJoinAndSelect('recommendations.postId', 'rec_post')
      .leftJoinAndSelect(
        'recommendations.patternProductId',
        'rec_pattern_product',
      )
      .leftJoinAndSelect(
        'recommendations.sewingProductId',
        'rec_sewing_product',
      )
      .leftJoin('rec_master_class.images', 'rec_master_class_images')
      .leftJoin('rec_pattern_product.images', 'rec_pattern_product_images')
      .leftJoin('rec_sewing_product.images', 'rec_sewing_product_images')
      .leftJoin('rec_post.image', 'rec_post_image')
      .leftJoin('rec_pattern_product.options', 'rec_pattern_product_options')
      .leftJoin('rec_sewing_product.options', 'rec_sewing_product_options')
      .andWhere('master_class.id = :id', { id })
      .andWhere('master_class.deleted = false');

    if (userId) {
      query
        .leftJoinAndSelect(
          'master_class.like',
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

    const { entities, raw } = await query.getRawAndEntities();

    return entities.map((item: any, index) => {
      item.isPurchased = raw[index].isPurchased;
      return item;
    })[0];
  }

  async findLiked(
    params: findAllMasterClassParamsDto,
  ): Promise<[MasterClassEntity[], number]> {
    const { take, skip, sort, by, where, category, lang, userId } = params;
    const query = await this.createQueryBuilder('master_class')
      .leftJoin('master_class.images', 'images')
      .leftJoin('master_class.categories', 'categories')
      .leftJoin('master_class.like', 'like', 'like.userId = :userId', {
        userId,
      })
      .select([
        'master_class.id',
        'master_class.type',
        'master_class.vendorCode',
        'master_class.createdDate',
        'master_class.titleRu',
        'master_class.modifierRu',
        'master_class.discount',
        'master_class.price',
        'master_class.deleted',
        'master_class.inEnglish',
        'master_class.clickCount',
        'images',
        'categories.id',
        'categories.categoryNameRu',
        'like',
      ])
      .take(take)
      .skip(skip)
      .orderBy(sort, by)

      .where('master_class.deleted = false')
      .andWhere('master_class.inEnglish = :lang', { lang: lang === 'en' })
      .andWhere('like.userId = :userId', { userId });

    if (where) {
      query.andWhere('master_class.titleRu ILIKE :search', {
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
    params: findAllMasterClassParamsDto,
  ): Promise<[MasterClassEntity[], number]> {
    const { take, skip, sort, by, where, category, lang } = params;
    const query = await this.createQueryBuilder('master_class')
      .leftJoin('master_class.images', 'images')
      .leftJoin('master_class.categories', 'categories')
      .select([
        'master_class.id',
        'master_class.type',
        'master_class.vendorCode',
        'master_class.createdDate',
        'master_class.titleRu',
        'master_class.modifierRu',
        'master_class.discount',
        'master_class.price',
        'master_class.deleted',
        'master_class.inEnglish',
        'master_class.clickCount',
        'images',
        'categories.id',
        'categories.categoryNameRu',
      ])
      .orderBy(sort, by)
      .take(take)
      .skip(skip)
      .where('master_class.inEnglish = :lang', { lang: lang === 'en' });

    if (where) {
      query.andWhere('master_class.titleRu ILIKE :search', {
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

  async getOneForAdmin(id: string): Promise<MasterClassEntity> {
    return await this.createQueryBuilder('master_class')
      .leftJoin('master_class.images', 'images')
      .leftJoin('master_class.categories', 'categories')
      .leftJoin('master_class.recommendation', 'recommendation')
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
          'master_class.id',
          'master_class.type',
          'master_class.vendorCode',
          'master_class.createdDate',
          'master_class.titleRu',
          'master_class.modifierRu',
          'master_class.descriptionRu',
          'master_class.materialRu',
          'master_class.articleRu',
          'master_class.discount',
          'master_class.price',
          'master_class.deleted',
          'master_class.inEnglish',
          'images',
          'categories.id',
          'categories.categoryNameRu',
        ].concat(recommendations),
      )

      .where('master_class.id = :id', { id })

      .getOne();
  }
}
