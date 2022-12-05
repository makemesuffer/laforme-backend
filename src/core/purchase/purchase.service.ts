import * as shortid from 'shortid';
import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PurchaseEntity } from './purchase.entity';
import { PurchaseRepository } from './purchase.repository';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PURCHASE_ERROR } from './enum/purchase.enum';
import { MailService } from '../mail/mail.service';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PaymentService } from '../payment/payment.service';
import { Currency } from '../payment/enum/payment.enum';
import { SdekService } from '../sdek/sdek.service';
import { DELIVERY_TYPE, PURCHASE_STATUS } from './enum/purchase.status';
import { UserRepository } from '../user/user.repository';
import { UserEntity } from '../user/user.entity';
import { PurchaseProductRepository } from '../purchase-product/purchase-product.repository';
import { ProductOptionRepository } from '../product-option/product-option.repository';
import { FileUploadRepository } from '../file-upload/file-upload.repository';
import { PurchaseUtils } from 'src/core/purchase/purchase.utils';

@Injectable()
export class PurchaseService {
  constructor(
    private purchaseRepository: PurchaseRepository,
    private purchaseProductRepository: PurchaseProductRepository,
    private userRepository: UserRepository,
    @Inject(forwardRef(() => PaymentService))
    private paymentService: PaymentService,
    private mailService: MailService,
    private sdekService: SdekService,
    private productOptionRepository: ProductOptionRepository,
    private fileUploadRepository: FileUploadRepository,
    private purchaseUtils: PurchaseUtils,
  ) {}

  async openFiles(user, purchaseProductId): Promise<any> {
    const purchaseProduct = await this.purchaseProductRepository.findOne({
      where: { id: purchaseProductId },
      relations: [
        'purchase',
        'masterClassId',
        'patternProductId',
        'sewingProductId',
        'optionId',
      ],
    });
    const purchase = await this.purchaseRepository.findOne({
      where: {
        userId: user.id,
        id: purchaseProduct.purchase.id,
      },
    });
    if (
      purchase &&
      purchase.orderStatus == 2 &&
      purchaseProduct.isClosed == false
    ) {
      if (purchaseProduct.patternProductId) {
        const option = await this.productOptionRepository.findOne({
          id: purchaseProduct.optionId.id,
        });
        const files = await this.fileUploadRepository.find({
          optionFilePdf: option.id,
        });

        await await this.purchaseProductRepository.update(purchaseProductId, {
          isOpen: true,
        });
        return files;
      }
      if (purchaseProduct.masterClassId) {
        const files = await this.fileUploadRepository.find({
          masterClassId: purchaseProduct.masterClassId,
        });

        await await this.purchaseProductRepository.update(purchaseProductId, {
          isOpen: true,
        });
        return files;
      }
      if (purchaseProduct.sewingProductId) {
        const files = await this.fileUploadRepository.find({
          sewingProductId: purchaseProduct.sewingProductId,
        });
        await await this.purchaseProductRepository.update(purchaseProductId, {
          isOpen: true,
        });
        return files;
      }
    }
  }

  //Получение

  async getAll(
    take: number,
    skip: number,
    from: Date,
    to: Date,
    status: PURCHASE_STATUS,
    orderNumber: string,
  ): Promise<[PurchaseEntity[], number]> {
    return await this.purchaseRepository.getAll(
      take,
      skip,
      from,
      to,
      status,
      orderNumber,
    );
  }
  async getAllForUser(
    take: number,
    skip: number,
    from: Date,
    to: Date,
    status: PURCHASE_STATUS,
    orderNumber: string,
    userId,
  ): Promise<[PurchaseEntity[], number]> {
    return await this.purchaseRepository.getAllForUser(
      take,
      skip,
      from,
      to,
      status,
      orderNumber,
      userId,
    );
  }
  async getOne(id: string): Promise<PurchaseEntity> {
    return await this.purchaseRepository.getOne(id);
  }
  async getOneForUser(id: string, userId) {
    return await this.purchaseProductRepository.getPaidProduct(id, userId);
  }
  async getOnePaymentMasterClass(id: string) {
    try {
      return await this.purchaseProductRepository.getPaidMasterClass(id);
    } catch (error) {
      throw new BadRequestException(
        PURCHASE_ERROR.MASTER_CLASS_SUBSCRIPTION_EXPIRED,
      );
    }
  }

  // Создание/обновление

  async createAndSignUp(body: CreatePurchaseDto) {
    const user = await this.userRepository.findOne({
      email: body.purchase.email,
    });

    if (!user) {
      const generatePassword = shortid.generate();
      const user = await this.userRepository.save({
        email: body.purchase.email,
        login: body.purchase.email.split('@')[0],
        password: await UserEntity.hashPassword(generatePassword),
        emailConfirmed: true,
      });
      await this.mailService.sendUserInfo(
        user.email,
        generatePassword,
        user.login,
      );
      return this.create(body, user);
    }
  }

  async create(body: CreatePurchaseDto, user: UserEntity): Promise<any> {
    const purchaseProducts = await this.purchaseUtils.verifyProducts(
      body.purchaseProducts,
    );

    const purchase = new PurchaseEntity();

    if (body.purchase.promoCode) {
      const promoCode = await this.purchaseUtils.verifyPromo(
        body.purchase.promoCode,
      );
      purchase.promoCode = promoCode?.promoCode;
      purchase.promoCodeDiscount = promoCode?.promoCodeDiscount;
      // body.purchase.promoCodeDiscount = promoCodeDiscount;
      // body.purchase.promoCode = promoCode;
    }

    purchase.userId = user;
    purchase.email = user.email;
    purchase.firstName = body.purchase.firstName;
    purchase.lastName = body.purchase.lastName;
    purchase.phone = body.purchase.phone;
    purchase.comment = body.purchase.comment;
    purchase.address = body.purchase.address?.value;

    purchase.price = purchaseProducts.price;
    // body.purchase.price = +purchaseProducts.price.toFixed(2);

    purchase.isDelivery = body.purchase.isDelivery;

    if (body.purchase.isDelivery) {
      purchase.deliveryType = body.purchase.deliveryType;
      purchase.deliveryName = body.purchase.deliveryName;
      purchase.cdekTariffCode = body.purchase.cdekTariffCode;
      purchase.cdekCityCode = body.purchase.cdekCityCode;
      purchase.cdekCityName = body.purchase.cdekCityName;
      purchase.cdekPointCode = body.purchase.cdekPointCode;
      purchase.cdekPointAddress = body.purchase.cdekPointAddress;
    }

    //@ts-ignore
    purchase.purchaseProducts = purchaseProducts.products;

    const payment = {
      amount: (+purchase.price).toFixed(2),
      currency: Currency.RUB,
      orderNumber: undefined,
      testMode: 1,
    };

    if (purchase.deliveryType === DELIVERY_TYPE.PICKUP) {
      payment.amount = (+purchase.price).toFixed(2);
    }

    if (purchase.deliveryType === DELIVERY_TYPE.POST_OFFICE) {
      purchase.shippingPrice = 400;
      payment.amount = (+purchase.price + 400).toFixed(2);
    }

    if (purchase.deliveryType === DELIVERY_TYPE.CDEK_COURIER) {
      const amount = purchase.purchaseProducts.reduce((acc, item) => {
        if (item.type === 2 || item.type === 3) {
          acc += +item.totalCount;
        }
        return acc;
      }, 0);

      const { total_sum } = await this.sdekService.сalculationByTariffCode({
        tariff_code: purchase.cdekTariffCode,
        to_location: {
          address: purchase.address,
        },
        amount: amount,
      });

      purchase.shippingPrice = total_sum;
      payment.amount = (purchase.price + total_sum).toFixed(2);
    }
    if (purchase.deliveryType === DELIVERY_TYPE.CDEK_POINT) {
      const amount = purchase.purchaseProducts.reduce((acc, item) => {
        if (item.type === 2 || item.type === 3) {
          acc += +item.totalCount;
        }
        return acc;
      }, 0);

      const { total_sum } = await this.sdekService.сalculationByTariffCode({
        tariff_code: purchase.cdekTariffCode,
        to_location: {
          code: purchase.cdekCityCode,
        },
        amount: amount,
      });

      purchase.shippingPrice = total_sum;
      payment.amount = (purchase.price + total_sum).toFixed(2);
    }

    try {
      await purchase.save();
      await purchase.save(); // Это важно так как orderNumber не сохранится
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error);
    }

    // Если цена товара будет 0 то заказ будет автоматом сделан оплаченым
    if (+payment.amount) {
      payment.orderNumber = purchase.orderNumber;
      return await this.paymentService.getPayAnyWayLink(payment, user.id);
    } else {
      return await this.paymentService.successLink(purchase.orderNumber);
    }
  }

  async update(id: string, body: UpdatePurchaseDto) {
    const purchase = await this.purchaseRepository.findOneOrFail(
      { id },
      { relations: ['purchaseProducts'] },
    );
    if (!purchase) {
      throw new BadRequestException(PURCHASE_ERROR.PURCHASE_NOT_FOUND);
    }

    const { products, price } = await this.purchaseUtils.verifyProducts(
      body.purchaseProducts,
    );

    if (
      body.promoCode &&
      body.promoCode !== purchase.promoCode &&
      purchase.orderStatus !== PURCHASE_STATUS.PAID
    ) {
      const { promoCode, promoCodeDiscount } =
        await this.purchaseUtils.verifyPromo(body.promoCode);

      purchase.promoCode = promoCode || null;
      purchase.promoCodeDiscount = promoCodeDiscount || 0;
    }
    const statusChanged = purchase.orderStatus !== body.orderStatus;

    purchase.orderStatus = body.orderStatus;
    purchase.email = body.email;
    purchase.firstName = body.firstName;
    purchase.lastName = body.lastName;
    purchase.address = body.address;
    purchase.phone = body.phone;
    purchase.comment = body.comment;
    purchase.price = price;
    //@ts-ignore
    purchase.purchaseProducts = products;
    await purchase.save();

    if (!statusChanged) return;

    for (const item of purchase.purchaseProducts) {
      if (item.type === 0) {
        const ppMc = await this.purchaseProductRepository.findOne({
          where: {
            masterClassId: item.masterClassId,
            purchase: purchase,
          },
        });
        if (ppMc) {
          if (purchase.orderStatus === PURCHASE_STATUS.PAID) {
            const expired = new Date();
            expired.setMonth(expired.getMonth() + 6);
            ppMc.expiredDate = expired;
          } else {
            ppMc.expiredDate = new Date();
          }
          await ppMc.save();
        }
      }
    }
  }
}
