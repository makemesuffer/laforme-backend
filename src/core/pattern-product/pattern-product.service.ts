import { PatternProductRepository } from './pattern-product.repository';
import { PatternProductEntity } from './pattern-product.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PatternProductDto } from './dto/pattern-product.dto';
import { ProductOptionEntity } from '../product-option/product-option.entity';
import { ProductOptionService } from '../product-option/product-option.service';
import { PurchaseProductRepository } from '../purchase-product/purchase-product.repository';
import { PURCHASE_ERROR } from '../purchase/enum/purchase.enum';
import {
  findAllPatternParamsDto,
  findOnePatternParamsDto,
} from './dto/pattern-find-params.dto';

@Injectable()
export class PatternProductService {
  constructor(
    private patternProductRepository: PatternProductRepository,
    private productOptionService: ProductOptionService,
    private purchaseProductRepository: PurchaseProductRepository,
  ) {}

  async getAll(
    params: findAllPatternParamsDto,
  ): Promise<[PatternProductEntity[], number]> {
    if (params.sort === 'title') {
      params.sort = 'pattern_product.titleRu';
    } else if (params.sort === 'date') {
      params.sort = 'pattern_product.createdDate';
    } else if (params.sort === 'clicks') {
      params.sort = 'pattern_product.clickCount';
    } else {
      params.sort = '';
    }

    if (params.type === 'printed') {
      params.type = '2';
    } else if (params.type === 'electronic') {
      params.type = '1';
    } else {
      params.type = '';
    }

    if (params.getAll) {
      return await this.patternProductRepository.findAllForAdmin(params);
    }

    return await this.patternProductRepository.findAll(params);
  }

  async getOne(params: findOnePatternParamsDto): Promise<any> {
    const result = await this.patternProductRepository.findOneProduct(params);
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

  async getLiked(
    params: findAllPatternParamsDto,
  ): Promise<[PatternProductEntity[], number]> {
    if (params.sort === 'title') {
      params.sort = 'pattern_product.titleRu';
    } else if (params.sort === 'date') {
      params.sort = 'pattern_product.createdDate';
    } else if (params.sort === 'clicks') {
      params.sort = 'pattern_product.clickCount';
    } else {
      params.sort = '';
    }

    if (params.type === 'printed') {
      params.type = '2';
    } else if (params.type === 'electronic') {
      params.type = '1';
    } else {
      params.type = '';
    }

    return await this.patternProductRepository.findLiked(params);
  }

  async getOneForUpdate(id: string): Promise<PatternProductEntity> {
    return await this.patternProductRepository.findOneForUpdate(id);
  }

  async create(body: PatternProductDto): Promise<PatternProductEntity> {
    if (!Boolean(body.vendorCode)) {
      body.vendorCode = PatternProductEntity.getVendorCode();
    }
    body.options = body.options.map((item, index) => {
      item.vendorCode = `${body.vendorCode}-${item.size || index}`;
      return item;
    });

    return await this.patternProductRepository.save(body);
  }

  async update(id: string, body: PatternProductDto) {
    body.id = id;
    body.options = body.options.map((item, index) => {
      item.vendorCode = `${body.vendorCode}-${item.size || index}`;
      return item;
    });
    return await this.patternProductRepository.save(body);
  }

  async delete(id: string) {
    const patternProduct = await this.patternProductRepository.findOneOrFail(
      id,
    );
    const wasPurchased = await this.purchaseProductRepository.findOne({
      patternProductId: patternProduct,
    });

    if (Boolean(wasPurchased)) {
      throw new BadRequestException(PURCHASE_ERROR.PRODUCT_WAS_PURCHASED);
    } else {
      await this.patternProductRepository.delete(id);
    }
  }

  async disable(id: string, deleted: boolean) {
    await this.patternProductRepository.update({ id }, { deleted });
  }

  async getPriceAndDiscount(
    patternProduct: PatternProductEntity,
    option: ProductOptionEntity,
  ): Promise<{
    totalPrice: number;
    totalDiscount: number;
  }> {
    const result = option
      ? await this.patternProductRepository.findOneAndOption(
          String(patternProduct),
          String(option),
        )
      : await this.patternProductRepository.findOne(patternProduct, {
          select: ['price', 'discount'],
        });
    return {
      totalPrice: result.price || result.options?.[0].price || 0,
      totalDiscount: result.discount || result.options?.[0].discount,
    };
  }

  async getPriceAndDiscountAndCount(
    patternProduct: PatternProductEntity,
    option: ProductOptionEntity,
  ): Promise<{
    title: string;
    totalPrice: number;
    totalDiscount: number;
    totalCount: number;
    isCount: boolean;
  }> {
    const result = option
      ? await this.patternProductRepository.findOneAndOption(
          String(patternProduct),
          String(option),
        )
      : await this.patternProductRepository.findOne(patternProduct, {
          select: [
            'price',
            'discount',
            'count',
            'titleEn',
            'titleRu',
            'isCount',
          ],
        });

    return {
      title: result.titleRu || result.titleEn,
      totalPrice: result.price || result.options?.[0].price || 0,
      totalDiscount: result.discount || result.options?.[0].discount,
      totalCount: result.count || result.options?.[0].count || 0,
      isCount: result.isCount,
    };
  }

  async updateCount(
    patternProduct: PatternProductEntity,
    option: ProductOptionEntity,
    count: number = 0,
  ) {
    if (option) {
      const result = await this.patternProductRepository.findOneAndOption(
        String(patternProduct),
        String(option),
      );

      if (!Boolean(result.options.length)) return;
      if (result.isCount && Number(result.options[0].count) >= Number(count)) {
        const newCount = Number(result.options[0].count) - Number(count);
        await this.productOptionService.update(result.options[0].id, {
          count: newCount,
        });
      }
    } else {
      const result = await this.patternProductRepository.findOneOrFail(
        patternProduct,
        {
          select: ['id', 'count', 'isCount'],
        },
      );
      if (!Boolean(result)) return;
      if (result.isCount && Number(result.count) >= Number(count)) {
        const newCount = Number(result.count) - Number(count);
        await this.patternProductRepository.update(result.id, {
          count: newCount,
        });
      }
    }
  }
}

// async getOneAuth(
//     id: string,
//     query: string,
//     userId: number,
//   ): Promise<PatternProductEntity> {
//     if (query === 'ru')
//       return await this.patternProductRepository.findOneRuAuth(id, userId);

//     if (query === 'en')
//       return await this.patternProductRepository.findOneEnAuth(id, userId);
//   }
// async getAllAuth(
//     query: string,
//     size: number,
//     page: number,
//     sort: string,
//     by: 'DESC' | 'ASC',
//     where: string,
//     type: string,
//     category: string,
//     userId: number,
//   ): Promise<[PatternProductEntity[], number]> {
//     if (sort === 'title') {
//       if (query === 'ru') {
//         sort = 'pattern_product.titleRu';
//       }
//       if (query === 'en') {
//         sort = 'pattern_product.titleEn';
//       }
//     } else if (sort === 'date') {
//       sort = 'pattern_product.createdDate';
//     } else if (sort === 'clicks') {
//       sort = 'pattern_product.clickCount';
//     } else sort = '';
//     if (type === 'printed') {
//       type = '2';
//     } else if (type === 'electronic') {
//       type = '1';
//     } else {
//       type = '';
//     }

//     if (query === 'ru')
//       return await this.patternProductRepository.findAllRuAuth(
//         size,
//         page,
//         sort,
//         by,
//         where,
//         type,
//         category,
//         userId,
//       );
//     if (query === 'en')
//       return await this.patternProductRepository.findAllEnAuth(
//         size,
//         page,
//         sort,
//         by,
//         where,
//         type,
//         category,
//         userId,
//       );
//   }

// import { CategoryRepository } from '../category/category.repository';
// import { FileUploadService } from '../file-upload/file-upload.service';
// import {
//   uploadImagesScript,
//   uploadFilesScript,
// } from 'src/common/utils/file-upload';
// import { FileUploadRepository } from '../file-upload/file-upload.repository';
// import { ProductOptionRepository } from '../product-option/product-option.repository';
//import * as fs from 'fs';
// async createMass(body: any): Promise<any> {
//     var fs = require('fs');
//     var content = fs.readFileSync('./output/products.json', 'utf-8');
//     var object = JSON.parse(content);

//     for (let s of object) {
//       let cat = [];
//       for (let k of s.categories) {
//         const category = await this.categoryRepository.findOne({
//           where: {
//             categoryNameRu: k,
//           },
//         });
//         cat.push({ id: category.id });
//         // if (!category) {
//         //   await this.categoryRepository.save({
//         //     categoryNameRu: k,
//         //     type: '1',
//         //   });
//         // }
//       }
//       let arr = [];
//       for (let image of s.images) {
//         const imageName = image.substr(image.lastIndexOf('/') + 1);
//         const fileUrl = await uploadImagesScript(imageName);
//         const g = await this.fileRepository.save({ fileUrl: fileUrl });
//         arr.push(g);
//       }

//       const data = {
//         wpId: s.id,
//         vendorCode: s.vendor_code,
//         titleRu: s.name,
//         shortDescription: s.short_description,
//         descriptionRu: s.description,
//         type: 2,
//         categories: cat,
//         images: arr,
//       };
//       const res = await this.patternProductRepository.save(data);
//       for (let option of s.options) {
//         const fileUrl = await uploadFilesScript(option.file_name);

//         const newOption = {
//           vendorCode: option.vendor_code,
//           size: option.size,
//           price: option.price,
//           patternProductId: res,
//         };
//         const y = await this.productOptionRepository.save(newOption);
//         const i = await this.fileRepository.save({
//           fileUrl: fileUrl,
//           optionFilePdf: y.id,
//         });
//       }
//     }
//     // }
//     //   for (let image of s.images) {
//     //     const imageName = image.substr(image.lastIndexOf('/') + 1);
//     //     const fileUrl = await uploadImagesScript(imageName);
//     //     const g = await this.fileRepository.save({ fileUrl: fileUrl });
//     //     arr.push(g);
//     //   }
//     //   const data = {
//     //     wpId: s.id,
//     //     vendorCode: s.vendor_code,
//     //     titleRu: s.name,
//     //     shortDescription: s.short_description,
//     //     descriptionRu: s.description,
//     //     type: 2,
//     //     categories: [{ id: category.id }],
//     //     images: arr,
//     //   };
//     //   const res = await this.patternProductRepository.save(data);
//     //   for (let option of s.options) {
//     //     const fileUrl = await uploadFilesScript(option.file_name);

//     //     const newOption = {
//     //       vendorCode: option.vendor_code,
//     //       size: option.size,
//     //       price: option.price,
//     //       patternProductId: res,
//     //     };
//     //     const y = await this.productOptionRepository.save(newOption);
//     //     const i = await this.fileRepository.save({
//     //       fileUrl: fileUrl,
//     //       optionFilePdf: y.id,
//     //     });
//     //   }
//   }
