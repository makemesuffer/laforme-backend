import { BadRequestException, Injectable } from '@nestjs/common';
import { MasterClassRepository } from './master-class.repository';
import { MasterClassEntity } from './master-class.entity';
import { MasterClassDto } from './dto/master-class.dto';
import { PurchaseProductRepository } from '../purchase-product/purchase-product.repository';
import { PURCHASE_ERROR } from '../purchase/enum/purchase.enum';
import {
  findAllMasterClassParamsDto,
  findOneMasterClassParamsDto,
} from './dto/master-class-find-params.dto';

@Injectable()
export class MasterClassService {
  constructor(
    private masterClassRepository: MasterClassRepository,
    private purchaseProductRepository: PurchaseProductRepository,
  ) {}

  async getAll(
    params: findAllMasterClassParamsDto,
  ): Promise<[MasterClassEntity[], number]> {
    if (params.sort === 'title') {
      params.sort = 'master_class.titleRu';
    } else if (params.sort === 'date') {
      params.sort = 'master_class.createdDate';
    } else if (params.sort === 'clicks') {
      params.sort = 'master_class.clickCount';
    } else {
      params.sort = '';
    }

    if (params.getAll) {
      return await this.masterClassRepository.findAllForAdmin(params);
    }

    return await this.masterClassRepository.findAll(params);
  }

  async getOne(
    params: findOneMasterClassParamsDto,
  ): Promise<MasterClassEntity> {
    const result = await this.masterClassRepository.findOneProduct(params);

    let recommendationProducts = [];
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
    return result;
  }

  async getLiked(
    params: findAllMasterClassParamsDto,
  ): Promise<[MasterClassEntity[], number]> {
    if (params.sort === 'title') {
      params.sort = 'master_class.titleRu';
    } else if (params.sort === 'date') {
      params.sort = 'master_class.createdDate';
    } else if (params.sort === 'clicks') {
      params.sort = 'master_class.clickCount';
    } else {
      params.sort = '';
    }

    return await this.masterClassRepository.findLiked(params);
  }

  async getOneForAdmin(id: string): Promise<MasterClassEntity> {
    return await this.masterClassRepository.getOneForAdmin(id);
  }

  async save(body: MasterClassDto): Promise<MasterClassEntity> {
    if (!Boolean(body.vendorCode)) {
      body.vendorCode = MasterClassEntity.getVendorCode();
    }
    return await this.masterClassRepository.save(body);
  }
  async update(id: string, body: MasterClassDto) {
    body.id = id;
    if (!Boolean(body.vendorCode)) {
      body.vendorCode = MasterClassEntity.getVendorCode();
    }
    return await this.masterClassRepository.save(body);
  }
  async delete(id: string) {
    const masterClass = await this.masterClassRepository.findOneOrFail(id);
    const wasPurchased = await this.purchaseProductRepository.findOne({
      masterClassId: masterClass,
    });

    if (Boolean(wasPurchased)) {
      throw new BadRequestException(PURCHASE_ERROR.PRODUCT_WAS_PURCHASED);
    } else {
      await this.masterClassRepository.delete(id);
    }
  }
  async disable(id: string, deleted: boolean) {
    await this.masterClassRepository.update({ id }, { deleted });
  }

  async getPriceAndDiscount(
    masterClass: MasterClassEntity,
  ): Promise<{ totalPrice: number; totalDiscount: number }> {
    const result = await this.masterClassRepository.findOne(masterClass, {
      select: ['id', 'price', 'discount'],
    });
    return {
      totalPrice: result.price || 0,
      totalDiscount: result.discount,
    };
  }
}
