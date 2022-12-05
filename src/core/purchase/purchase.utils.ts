import { Injectable, BadRequestException } from '@nestjs/common';
import { PurchaseProductDto } from '../purchase-product/dto/purchase-product.dto';
import { PatternProductService } from '../pattern-product/pattern-product.service';
import { SewingProductService } from '../sewing-product/sewing-product.service';
import { MasterClassService } from '../master-class/master-class.service';
import { VerifyPurchaseProductsDto } from './dto/verify-purchase-products.dto';
import { PromoCodeService } from '../promo-code/promo-code.service';
import { MasterClassEntity } from '../master-class/master-class.entity';
import { PatternProductEntity } from '../pattern-product/pattern-product.entity';
import { ProductOptionEntity } from '../product-option/product-option.entity';
import { SewingProductEntity } from '../sewing-product/sewing-product.entity';
import { PURCHASE_ERROR } from './enum/purchase.enum';
import { PurchaseEntity } from './purchase.entity';
import { MailService } from '../mail/mail.service';

class ProductParamsInfoType {
  title?: string;
  discount: number;
  price: number;
  totalPrice: number;
  isCount?: boolean;
  totalCount?: number;
  isLength?: boolean;
  totalLength?: number;
}
class getPriceProps {
  price: number;
  discount: number;
  isCount: boolean;
  count: number;
  isLength: boolean;
  length: number;
}

@Injectable()
export class PurchaseUtils {
  constructor(
    private promoCodeService: PromoCodeService,
    private patternProductService: PatternProductService,
    private sewingProductService: SewingProductService,
    private masterClassService: MasterClassService,
    private mailService: MailService,
  ) {}

  getPrice(props: getPriceProps): number {
    const {
      price = 0,
      discount = 0,
      isCount = false,
      count = 0,
      isLength = false,
      length = 0,
    } = props;
    if (isCount) {
      return (price - price * (discount / 100)) * count;
    } else if (isLength) {
      return (price - price * (discount / 100)) * length;
    } else {
      return (price - price * (discount / 100)) * 1;
    }
  }
  async getMasterProduct(
    id: MasterClassEntity,
  ): Promise<ProductParamsInfoType> {
    const result = await this.masterClassService.getPriceAndDiscount(id);
    return {
      discount: result.totalDiscount,
      price: result.totalPrice,
      totalPrice: this.getPrice({
        price: result.totalPrice,
        discount: result.totalDiscount,
        isCount: false,
        count: 1,
        isLength: false,
        length: 0,
      }),
    };
  }
  async getElectronicPatternProduct(
    id: PatternProductEntity,
    option: ProductOptionEntity,
  ): Promise<ProductParamsInfoType> {
    const result = await this.patternProductService.getPriceAndDiscount(
      id,
      option,
    );
    return {
      discount: result.totalDiscount,
      price: result.totalPrice,
      totalPrice: this.getPrice({
        price: result.totalPrice,
        discount: result.totalDiscount,
        isCount: false,
        count: 1,
        isLength: false,
        length: 0,
      }),
    };
  }
  async getPrintPatternProduct(
    id: PatternProductEntity,
    option: ProductOptionEntity,
    count: number,
  ): Promise<ProductParamsInfoType> {
    try {
      const result =
        await this.patternProductService.getPriceAndDiscountAndCount(
          id,
          option,
        );
      return {
        title: result.title,
        discount: result.totalDiscount,
        price: result.totalPrice,
        totalPrice: this.getPrice({
          price: result.totalPrice,
          discount: result.totalDiscount,
          isCount: result.isCount,
          count: count,
          isLength: false,
          length: 0,
        }),
        isCount: result.isCount,
        totalCount: result.totalCount,
      };
    } catch (error) {
      console.log(error);

      throw new BadRequestException('Ошибка сервера');
    }
  }
  async getSewingProduct(
    id: SewingProductEntity,
    option: ProductOptionEntity,
    count: number,
    length: number,
  ): Promise<ProductParamsInfoType> {
    const result =
      await this.sewingProductService.getPriceAndDiscountAndCountAndLength(
        id,
        option,
      );
    return {
      title: result.title,
      discount: result.totalDiscount,
      price: result.totalPrice,
      totalPrice: this.getPrice({
        price: result.totalPrice,
        discount: result.totalDiscount,
        isCount: result.isCount,
        count: count,
        isLength: result.isLength,
        length: length,
      }),
      isCount: result.isCount,
      totalCount: result.totalCount,
      isLength: result.isLength,
      totalLength: result.totalLength,
    };
  }
  async verifyProducts(
    purchaseProducts: PurchaseProductDto[],
  ): Promise<VerifyPurchaseProductsDto> {
    const totalResult = {
      products: [],
      price: 0,
    };
    for (const item of purchaseProducts) {
      if (item.type === 0) {
        const result = await this.getMasterProduct(item.masterClassId);
        const { discount, price, totalPrice } = result;
        item.totalDiscount = discount;
        item.totalPrice = price;
        item.totalCount = 1;
        totalResult.price = totalResult.price + totalPrice;
        totalResult.products.push(item);
      }
      if (item.type === 1) {
        const result = await this.getElectronicPatternProduct(
          item.patternProductId,
          item.optionId,
        );
        const { discount, price, totalPrice } = result;
        item.totalDiscount = discount;
        item.totalPrice = price;
        item.totalCount = 1;
        totalResult.price = totalResult.price + totalPrice;
        totalResult.products.push(item);
      }
      if (item.type === 2) {
        const result = await this.getPrintPatternProduct(
          item.patternProductId,
          item.optionId,
          item.totalCount,
        );
        const { title, discount, price, totalPrice, isCount, totalCount } =
          result;
        item.totalDiscount = discount;
        item.totalPrice = price;
        if (isCount && item.totalCount < 1) {
          throw new BadRequestException(
            `${title} - ${PURCHASE_ERROR.MINIMUM_COUNT_IS} - 1`,
          );
        }
        if (isCount && Number(totalCount) < Number(item.totalCount)) {
          throw new BadRequestException(
            `${title} - ${PURCHASE_ERROR.COUNT_GREATER_MAXIMUM} - ${totalCount}`,
          );
        }
        if (!isCount) item.totalCount = 1;
        totalResult.products.push(item);
        totalResult.price = totalResult.price + totalPrice;
      }
      if (item.type === 3) {
        const result = await this.getSewingProduct(
          item.sewingProductId,
          item.optionId,
          item.totalCount,
          item.totalLength,
        );
        const {
          title,
          discount,
          price,
          totalPrice,
          isCount,
          totalCount,
          isLength,
          totalLength,
        } = result;

        item.totalDiscount = discount;
        item.totalPrice = price;

        if (isCount && item.totalCount < 1) {
          throw new BadRequestException(
            `${title} - ${PURCHASE_ERROR.MINIMUM_COUNT_IS} - 1`,
          );
        }
        if (isLength && Number(item.totalLength) < 0.1) {
          throw new BadRequestException(
            `${title} - ${PURCHASE_ERROR.MINIMUM_LENGTH_IS} - 0.1`,
          );
        }
        if (isCount && Number(item.totalCount) > Number(totalCount)) {
          throw new BadRequestException(
            `${title} - ${PURCHASE_ERROR.COUNT_GREATER_MAXIMUM} - ${totalCount}`,
          );
        }
        if (
          isLength &&
          Math.ceil(Number(item.totalLength) * 100) >
            Math.ceil(Number(totalLength) * 100)
        ) {
          throw new BadRequestException(
            `${title} - ${PURCHASE_ERROR.LENGTH_GREATER_MAXIMUM} - ${totalLength}`,
          );
        }
        if (!isCount && !isLength) item.totalCount = 1;
        totalResult.products.push(item);
        totalResult.price = totalResult.price + totalPrice;
      }
    }
    return totalResult;
  }
  async verifyPromo(promoCode: string) {
    const result = await this.promoCodeService.checkFromServer(promoCode);
    return {
      promoCode: result?.promoCode,
      promoCodeDiscount: result?.discount,
    };
  }
  async sendPurchaseInfo(purchase: PurchaseEntity) {
    await this.mailService.sendPurchaseInfo(purchase);
    await this.mailService.sendAdminNewOrderInfo(purchase);
  }
}
