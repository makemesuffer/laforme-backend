import { PurchaseEntity } from './purchase.entity';
import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { PURCHASE_STATUS } from './enum/purchase.status';

@EntityRepository(PurchaseEntity)
export class PurchaseRepository extends Repository<PurchaseEntity> {
  async getAll(
    take: number,
    skip: number,
    from: Date,
    to: Date,
    status: PURCHASE_STATUS,
    orderNumber: string,
  ): Promise<[PurchaseEntity[], number]> {
    const query = await this.createQueryBuilder('purchase')
      .leftJoin('purchase.userId', 'user')
      .loadRelationCountAndMap(
        'purchase.purchaseProductsCount',
        'purchase.purchaseProducts',
      )
      .orderBy('purchase.createdDate', 'DESC')
      .take(take)
      .skip(skip)
      .select(['purchase', 'user.id']);

    if (orderNumber) {
      query.andWhere('purchase.orderNumber like :orderNumber', {
        orderNumber: `%${orderNumber}%`,
      });
    }
    if (status) {
      query.where('purchase.orderStatus = :status', {
        status,
      });
    }
    if (from && to) {
      query
        .andWhere('purchase.created_date >= :from', { from })
        .andWhere('purchase.created_date <= :to', { to });
    }
    return await query.getManyAndCount();
  }

  async getAllForUser(
    take: number,
    skip: number,
    from: Date,
    to: Date,
    status: PURCHASE_STATUS,
    orderNumber: string,
    userId,
  ): Promise<any> {
    const query = await this.createQueryBuilder('purchase')

      .leftJoin('purchase.userId', 'user')
      .loadRelationCountAndMap(
        'purchase.purchaseProductsCount',
        'purchase.purchaseProducts',
      )
      .orderBy('purchase.createdDate', 'DESC')
      .take(take)
      .skip(skip)
      .where('purchase.userId = :userId', {
        userId,
      });
    if (status) {
      query.where('purchase.orderStatus = :status', {
        status,
      });
    }
    if (orderNumber) {
      query.andWhere('purchase.orderNumber like :orderNumber', {
        orderNumber: `%${orderNumber}%`,
      });
    }
    if (from && to) {
      query
        .andWhere('purchase.createdDate >= :from', { from })
        .andWhere('purchase.createdDate <= :to', {
          to,
        });
    }
    return await query.getManyAndCount();
  }

  async getAllForEmail(id): Promise<PurchaseEntity> {
    return await this.createQueryBuilder('purchase')
      .leftJoin('purchase.purchaseProducts', 'purchase_products')

      .leftJoin('purchase_products.masterClassId', 'master_class')
      .leftJoin('master_class.images', 'm_c_images')
      .leftJoin('master_class.categories', 'm_c_categories')

      .leftJoin('purchase_products.patternProductId', 'pattern_product')
      .leftJoin('pattern_product.images', 'p_p_images')
      .leftJoin('pattern_product.categories', 'p_p_categories')
      .leftJoin('pattern_product.filesPdf', 'p_p_file_pdf')

      .leftJoin('purchase_products.sewingProductId', 'sewing_product')
      .leftJoin('sewing_product.images', 's_p_images')
      .leftJoin('sewing_product.categories', 's_p_categories')

      .leftJoin('purchase_products.optionId', 'option')
      .leftJoin('option.filesPdf', 'option_file_pdf')

      .select([
        'purchase',
        'purchase_products',

        'master_class.id',
        'master_class.type',
        'master_class.titleRu',
        'master_class.titleEn',
        'master_class.price',
        'master_class.discount',
        'master_class.vendorCode',
        'm_c_images',
        'm_c_categories',
        'm_c_categories.id',
        'm_c_categories.categoryNameRu',
        'm_c_categories.categoryNameEn',

        'pattern_product.id',
        'pattern_product.type',
        'pattern_product.titleRu',
        'pattern_product.titleEn',
        'pattern_product.price',
        'pattern_product.discount',
        'pattern_product.count',
        'pattern_product.vendorCode',
        'p_p_file_pdf',
        'p_p_images',
        'p_p_categories.id',
        'p_p_categories.categoryNameRu',
        'p_p_categories.categoryNameEn',

        'sewing_product.id',
        'sewing_product.type',
        'sewing_product.titleRu',
        'sewing_product.titleEn',
        'sewing_product.price',
        'sewing_product.discount',
        'sewing_product.count',
        'sewing_product.length',
        'sewing_product.vendorCode',
        's_p_images',
        's_p_categories.id',
        's_p_categories.categoryNameRu',
        's_p_categories.categoryNameEn',

        'option.id',
        'option.vendorCode',
        'option.size',
        'option_file_pdf',
        'option.colorRu',
        'option.colorEn',
        'option.count',
        'option.length',
        'option.price',
        'option.discount',
      ])
      .where('purchase.id = :id', { id })
      .getOne();
  }

  async getOne(id: string): Promise<PurchaseEntity> {
    return await this.createQueryBuilder('purchase')

      .leftJoin('purchase.purchaseProducts', 'purchase_products')

      .leftJoin('purchase_products.masterClassId', 'master_class')
      .leftJoin('master_class.images', 'm_c_images')
      .leftJoin('master_class.categories', 'm_c_categories')

      .leftJoin('purchase_products.patternProductId', 'pattern_product')
      .leftJoin('pattern_product.options', 'p_p_options')
      .leftJoin('pattern_product.images', 'p_p_images')
      .leftJoin('pattern_product.categories', 'p_p_categories')
      // .leftJoin('pattern_product.filesPdf', 'p_p_files_pdf')
      // .leftJoin('p_p_options.filesPdf', 'p_p_options_files_pdf')

      .leftJoin('purchase_products.sewingProductId', 'sewing_product')
      .leftJoin('sewing_product.options', 's_p_options')
      .leftJoin('sewing_product.images', 's_p_images')
      .leftJoin('sewing_product.categories', 's_p_categories')

      .leftJoin('purchase_products.optionId', 'option')
      // .leftJoin('option.filesPdf', 'option_files_pdf')

      .select([
        'purchase',
        'purchase_products',

        'option.id',
        'option.vendorCode',
        'option.size',
        // 'option_files_pdf',
        'option.colorRu',
        'option.colorEn',
        'option.count',
        'option.length',
        'option.price',
        'option.discount',

        'master_class.id',
        'master_class.type',
        'master_class.titleRu',
        'master_class.titleEn',
        'master_class.price',
        'master_class.discount',
        'm_c_images',
        'm_c_categories',
        'm_c_categories.id',
        'm_c_categories.categoryNameRu',
        'm_c_categories.categoryNameEn',

        'pattern_product.id',
        'pattern_product.type',
        'pattern_product.optionType',
        'pattern_product.titleRu',
        'pattern_product.titleEn',
        'pattern_product.price',
        'pattern_product.discount',
        'pattern_product.count',
        'pattern_product.isCount',
        // 'p_p_files_pdf',
        'p_p_images',
        'p_p_categories.id',
        'p_p_categories.categoryNameRu',
        'p_p_categories.categoryNameEn',

        'p_p_options.id',
        'p_p_options.vendorCode',
        'p_p_options.size',
        // 'p_p_options_files_pdf',
        'p_p_options.colorRu',
        'p_p_options.colorEn',
        'p_p_options.count',
        'p_p_options.length',
        'p_p_options.price',
        'p_p_options.discount',

        'sewing_product.id',
        'sewing_product.type',
        'sewing_product.optionType',
        'sewing_product.titleRu',
        'sewing_product.titleEn',
        'sewing_product.price',
        'sewing_product.discount',
        'sewing_product.count',
        'sewing_product.isCount',
        'sewing_product.length',
        'sewing_product.isLength',
        's_p_images',
        's_p_categories.id',
        's_p_categories.categoryNameRu',
        's_p_categories.categoryNameEn',

        's_p_options.id',
        's_p_options.vendorCode',
        's_p_options.size',
        's_p_options.colorRu',
        's_p_options.colorEn',
        's_p_options.count',
        's_p_options.length',
        's_p_options.price',
        's_p_options.discount',
      ])
      .where('purchase.id = :id', { id })
      .getOne();
  }

  async connectPurchasesToUser(user: UserEntity): Promise<any> {
    await this.update({ email: user.email }, { userId: user });
  }

  async statistics(from: Date, to: Date): Promise<any[]> {
    const query = await this.createQueryBuilder('purchase')
      .where('purchase.created_date >= :from', { from })
      .andWhere('purchase.created_date <= :to', { to });

    return await query.getMany();
  }
}
