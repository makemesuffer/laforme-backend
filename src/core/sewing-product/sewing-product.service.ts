import { SewingProductRepository } from './sewing-product.repository';
import { SewingProductEntity } from './sewing-product.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SewingProductDto } from './dto/sewing-product.dto';
import { ProductOptionEntity } from '../product-option/product-option.entity';
import { ProductOptionService } from '../product-option/product-option.service';
import { PurchaseProductRepository } from '../purchase-product/purchase-product.repository';
import { PURCHASE_ERROR } from '../purchase/enum/purchase.enum';
import {
  findAllSewingProductParamsDto,
  findOneSewingProductParamsDto,
} from './dto/sewing-product-find-params.dto';

@Injectable()
export class SewingProductService {
  constructor(
    private sewingProductRepository: SewingProductRepository,
    private productOptionService: ProductOptionService,
    private purchaseProductRepository: PurchaseProductRepository,
  ) {}

  async getAll(
    params: findAllSewingProductParamsDto,
  ): Promise<[SewingProductEntity[], number]> {
    if (params.sort === 'title') {
      params.sort = 'sewing_product.titleRu';
    } else if (params.sort === 'date') {
      params.sort = 'sewing_product.createdDate';
    } else if (params.sort === 'clicks') {
      params.sort = 'sewing_product.clickCount';
    } else {
      params.sort = '';
    }

    if (params.getAll) {
      return await this.sewingProductRepository.findAllForAdmin(params);
    }
    return await this.sewingProductRepository.findAll(params);
  }

  async getLiked(
    params: findAllSewingProductParamsDto,
  ): Promise<[SewingProductEntity[], number]> {
    if (params.sort === 'title') {
      params.sort = 'sewing_product.titleRu';
    } else if (params.sort === 'date') {
      params.sort = 'sewing_product.createdDate';
    } else if (params.sort === 'clicks') {
      params.sort = 'sewing_product.clickCount';
    } else {
      params.sort = '';
    }
    return await this.sewingProductRepository.findLiked(params);
  }

  async getOne(
    params: findOneSewingProductParamsDto,
  ): Promise<SewingProductEntity> {
    const result = await this.sewingProductRepository.findOneProduct(params);
    let options = [];
    let recommendationProducts = [];
    for (let r of result.options) {
      if (r.optionVisibility === true) {
        options.push(r);
      }
    }
    if (result.recommendation) {
      for (let r of result.recommendation.recommendationProducts) {
        if (r.masterClassId == null && r.patternProductId == null) {
          if (r.sewingProductId.deleted !== true) {
            recommendationProducts.push(r);
          }
        }
        if (r.sewingProductId == null && r.patternProductId == null) {
          if (r.masterClassId.deleted !== true) {
            recommendationProducts.push(r);
          }
        }
        if (r.masterClassId == null && r.sewingProductId == null) {
          if (r.patternProductId.deleted !== true) {
            recommendationProducts.push(r);
          }
        }
      }
      result.recommendation.recommendationProducts = recommendationProducts;
    }
    result.options = options;

    return result;
  }
  async getOneForUpdate(id: string): Promise<SewingProductEntity> {
    return await this.sewingProductRepository.findOneForUpdate(id);
  }

  async create(body: SewingProductDto): Promise<SewingProductEntity> {
    if (!Boolean(body.vendorCode)) {
      body.vendorCode = SewingProductEntity.getVendorCode();
    }
    body.options = body.options.map((item, index: number) => {
      if (body.optionType === 1) {
        item.vendorCode = `${body.vendorCode}-${item.size || index}-${
          item.colorRu || item.colorEn || index
        }`;
      } else if (body.optionType === 2) {
        item.vendorCode = `${body.vendorCode}-${item.size || index}`;
      } else if (body.optionType === 3) {
        item.vendorCode = `${body.vendorCode}-${
          item.colorRu || item.colorEn || index
        }`;
      }
      return item;
    });

    return await this.sewingProductRepository.save(body);
  }
  async update(id: string, body: SewingProductDto) {
    body.id = id;

    if (!Boolean(body.vendorCode)) {
      body.vendorCode = SewingProductEntity.getVendorCode();
    }

    body.options = body.options.map((item, index) => {
      if (body.optionType === 1) {
        item.vendorCode = `${body.vendorCode}-${item.size || index}-${
          item.colorRu || item.colorEn || index
        }`;
      } else if (body.optionType === 2) {
        item.vendorCode = `${body.vendorCode}-${item.size || index}`;
      } else if (body.optionType === 3) {
        item.vendorCode = `${body.vendorCode}-${
          item.colorRu || item.colorEn || index
        }`;
      }
      return item;
    });

    return await this.sewingProductRepository.save(body);
  }
  async delete(id: string) {
    const sewingProduct = await this.sewingProductRepository.findOneOrFail(id);
    const wasPurchased = await this.purchaseProductRepository.findOne({
      sewingProductId: sewingProduct,
    });

    if (Boolean(wasPurchased)) {
      throw new BadRequestException(PURCHASE_ERROR.PRODUCT_WAS_PURCHASED);
    } else {
      await this.sewingProductRepository.delete(id);
    }
  }
  async disable(id: string, deleted: boolean) {
    await this.sewingProductRepository.update({ id }, { deleted });
  }
  async getPriceAndDiscountAndCountAndLength(
    sewingProduct: SewingProductEntity,
    option: ProductOptionEntity,
  ): Promise<{
    title: string;
    totalPrice: number;
    totalDiscount: number;
    totalCount: number;
    totalLength: number;
    isCount: boolean;
    isLength: boolean;
  }> {
    const result = option
      ? await this.sewingProductRepository.findOneAndOption(
          String(sewingProduct),
          String(option),
        )
      : await this.sewingProductRepository.findOne(sewingProduct, {
          select: [
            'price',
            'discount',
            'count',
            'length',
            'titleRu',
            'titleEn',
            'isCount',
            'isLength',
          ],
        });
    return {
      title: result.titleRu || result.titleEn,
      totalPrice: result.price || result.options?.[0].price || 0,
      totalDiscount: result.discount || result.options?.[0].discount,
      totalCount: result.count || result.options?.[0].count || 0,
      totalLength: result.length || result.options?.[0].length || 0,
      isCount: result.isCount,
      isLength: result.isLength,
    };
  }
  async updateCountOrLength(
    sewingProduct: SewingProductEntity,
    option: ProductOptionEntity,
    count: number = 0,
    length: number = 0,
  ) {
    if (option) {
      const result = await this.sewingProductRepository.findOneAndOption(
        String(sewingProduct),
        String(option),
      );
      if (!Boolean(result.options.length)) return;

      if (
        Boolean(result.options[0].count) &&
        count &&
        Number(result.options[0].count) >= Number(count)
      ) {
        const newCount = result.options[0].count - Number(count);
        await this.productOptionService.update(result.options[0].id, {
          count: newCount,
        });
      }

      if (
        Boolean(result.options[0].length) &&
        length &&
        Number(result.options[0].length) >= Number(length)
      ) {
        const newLength = result.options[0].length - Number(length);
        await this.productOptionService.update(result.options[0].id, {
          length: newLength,
        });
      }
    } else {
      const result = await this.sewingProductRepository.findOneOrFail(
        sewingProduct,
        {
          select: ['id', 'count', 'length', 'isCount', 'isLength'],
        },
      );
      if (!Boolean(result)) return;
      if (result.isCount && Number(result.count) >= Number(count)) {
        const newCount = result.count - Number(count);
        await this.sewingProductRepository.update(result.id, {
          count: newCount,
        });
      } else if (
        result.isLength &&
        Math.ceil(Number(result.length) * 100) >=
          Math.ceil(Number(length) * 100)
      ) {
        const newLength = Number(
          (Number(result.length) - Number(length)).toFixed(2),
        );
        await this.sewingProductRepository.update(result.id, {
          length: newLength,
        });
      }
    }
  }
}
