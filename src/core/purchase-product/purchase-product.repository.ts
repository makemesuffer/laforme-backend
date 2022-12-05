import { EntityRepository, Repository } from 'typeorm';
import { PurchaseProductEntity } from './purchase-product.entity';
import { StatisticType } from '../statistics/enum/statistic.enum';
import { PURCHASE_STATUS } from '../purchase/enum/purchase.status';
@EntityRepository(PurchaseProductEntity)
export class PurchaseProductRepository extends Repository<PurchaseProductEntity> {
  async getPaidProduct(
    id: string,
    userId: number,
  ): Promise<PurchaseProductEntity> {
    return await this.createQueryBuilder('purchase_product')
      .leftJoin('purchase_product.purchase', 'purchase')

      .leftJoin('purchase_product.optionId', 'option')
      .leftJoin('option.filesPdf', 'option_filesPdf')

      .leftJoin('purchase_product.masterClassId', 'master_class')
      .leftJoin('master_class.images', 'master_class_images')
      .leftJoin('master_class.categories', 'master_class_categories')

      .leftJoin('purchase_product.patternProductId', 'pattern_product')
      .leftJoin('pattern_product.images', 'pattern_product_images')
      .leftJoin('pattern_product.categories', 'pattern_product_categories')
      .leftJoin('pattern_product.filesPdf', 'pattern_product_filesPdf')

      .leftJoin('purchase_product.sewingProductId', 'sewing_product')
      .leftJoin('sewing_product.images', 'sewing_product_images')
      .leftJoin('sewing_product.categories', 'sewing_product_categories')

      .select([
        'purchase',
        'purchase_product.id',
        'purchase_product.createdDate',
        'purchase_product.type',
        'purchase_product.totalCount',
        'purchase_product.totalLength',
        'purchase_product.totalDiscount',
        'purchase_product.totalPrice',

        'master_class.id',
        'master_class.createdDate',
        'master_class.vendorCode',
        'master_class.titleRu',
        'master_class.titleEn',
        'master_class.modifierRu',
        'master_class.modifierEn',
        'master_class.articleRu',
        'master_class.articleEn',
        'master_class.descriptionRu',
        'master_class.descriptionEn',
        'master_class.type',
        'master_class_images',
        'master_class_categories',

        'pattern_product.id',
        'pattern_product.optionType',
        'pattern_product.vendorCode',
        'pattern_product.id',
        'pattern_product.titleRu',
        'pattern_product.titleEn',
        'pattern_product.modifierRu',
        'pattern_product.modifierEn',
        'pattern_product.descriptionRu',
        'pattern_product.descriptionEn',
        'pattern_product.descriptionOld',
        'pattern_product.materialRu',
        'pattern_product.materialEn',
        'pattern_product.materialOld',
        'pattern_product.complexity',
        'pattern_product.type',
        'pattern_product.discount',
        'pattern_product.price',
        'pattern_product_images',
        'pattern_product_categories',
        'pattern_product_filesPdf',

        'sewing_product.id',
        'sewing_product.optionType',
        'sewing_product.vendorCode',
        'sewing_product.discount',
        'sewing_product.price',
        'sewing_product.count',
        'sewing_product.length',
        'sewing_product.titleRu',
        'sewing_product.titleEn',
        'sewing_product.modifierRu',
        'sewing_product.modifierEn',
        'sewing_product.descriptionRu',
        'sewing_product.descriptionEn',
        'sewing_product.type',
        'sewing_product_images',
        'sewing_product_categories',

        'option.id',
        'option.vendorCode',
        'option.size',
        'option.colorRu',
        'option.colorEn',
        'option_filesPdf',
      ])

      .where('purchase_product.id = :id', { id })
      .andWhere('purchase.orderStatus = :orderStatus', {
        orderStatus: PURCHASE_STATUS.PAID,
      })
      .andWhere('purchase.userId = :userId', { userId })
      .getOne();
  }

  async getPaidMasterClass(id: string): Promise<PurchaseProductEntity> {
    return await this.createQueryBuilder('purchase_product')
      .leftJoin('purchase_product.purchase', 'purchase')
      .leftJoinAndSelect('purchase_product.masterClassId', 'masterClass')
      .leftJoinAndSelect('masterClass.images', 'masterClassImages')
      .leftJoinAndSelect('masterClass.categories', 'masterClassCategories')
      .where('purchase_product.id = :id', { id })
      .andWhere('purchase_product.expiredDate >= :now', { now: new Date() })
      .andWhere('purchase.orderStatus = :orderStatus', {
        orderStatus: PURCHASE_STATUS.PAID,
      })

      .getOneOrFail();
  }

  async statistics(from: Date, to: Date, type: StatisticType): Promise<any[]> {
    const query = await this.createQueryBuilder('purchase_product')
      .where('purchase_product.created_date >= :from', { from })
      .andWhere('purchase_product.created_date <= :to', { to });
    if (type === StatisticType.MasterClass) {
      query
        .andWhere('purchase_product.masterClassId is not null')
        .andWhere('purchase_product.patternProductId is null')
        .andWhere('purchase_product.sewingProductId is null');
    }
    if (type === StatisticType.ElectronicPatternProduct) {
      query
        .leftJoin('purchase_product.patternProductId', 'patternProductId')
        .andWhere('patternProductId.type = 1')
        .andWhere('purchase_product.masterClassId is null')
        .andWhere('purchase_product.patternProductId is not null')
        .andWhere('purchase_product.sewingProductId is null');
    }
    if (type === StatisticType.PrintedPatternProduct) {
      query
        .leftJoin('purchase_product.patternProductId', 'patternProductId')
        .andWhere('patternProductId.type = 2')
        .andWhere('purchase_product.masterClassId is null')
        .andWhere('purchase_product.patternProductId is not null')
        .andWhere('purchase_product.sewingProductId is null');
    }
    if (type === StatisticType.SewingProduct) {
      query
        .andWhere('purchase_product.masterClassId is null')
        .andWhere('purchase_product.patternProductId is null')
        .andWhere('purchase_product.sewingProductId is not null');
    }
    if (type === StatisticType.PrintProduct) {
      query
        .leftJoin('purchase_product.patternProductId', 'patternProductId')
        .andWhere(
          'purchase_product.sewingProductId is not null OR patternProductId.type = 2',
        );
    }
    if (type === StatisticType.ElectronicProduct) {
      query
        .leftJoin('purchase_product.patternProductId', 'patternProductId')
        .andWhere(
          'purchase_product.masterClassId is not null OR patternProductId.type = 1',
        );
    }
    return await query.getMany();
  }
}
