import * as md5 from 'md5';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PayAnyWayConfig } from 'src/config/payanyway.config';
import { PaymentDto } from './dto/payment.dto';
import { PurchaseRepository } from '../purchase/purchase.repository';
import {
  DELIVERY_TYPE,
  PURCHASE_STATUS,
} from '../purchase/enum/purchase.status';
import { SdekService } from '../sdek/sdek.service';
import { SdekConfig } from 'src/config/sdek.config';
import { PURCHASE_ERROR } from '../purchase/enum/purchase.enum';
import { ClientConfig } from 'src/config/client.config';
import { PaymentEntity } from 'src/core/payment/payment.entity';
import { Repository } from 'typeorm';
import { PurchaseUtils } from 'src/core/purchase/purchase.utils';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentEntity: Repository<PaymentEntity>,
    private purchaseRepository: PurchaseRepository,
    private sdekService: SdekService,
    private purchaseUtils: PurchaseUtils,
  ) {}

  async createTransaction(body): Promise<string> {
    return await this.paymentEntity.save(body);
  }
  async getPayAnyWayLink(body: PaymentDto, userId): Promise<string> {
    const signature = md5(
      PayAnyWayConfig.MNT_ID +
        body.orderNumber +
        body.amount +
        body.currency +
        userId +
        body.testMode +
        PayAnyWayConfig.MNT_INTEGRITY_CODE,
    );
    //В конфиге в dev конфиге указана ссылка на сразу оплату поэтому только в проде будет пересылка на payanyway
    const url =
      PayAnyWayConfig.PAY_URL +
      `MNT_ID=` +
      PayAnyWayConfig.MNT_ID +
      `&MNT_AMOUNT=` +
      body.amount +
      `&MNT_TRANSACTION_ID=` +
      body.orderNumber +
      `&MNT_CURRENCY_CODE=` +
      body.currency +
      `&MNT_TEST_MODE=` +
      body.testMode +
      `&MNT_SUBSCRIBER_ID=` +
      userId +
      `&MNT_SIGNATURE=` +
      signature;
    return url;
  }
  async getPayAnyWayLinkByPurchaseId(id: string, user): Promise<string> {
    const purchase = await this.purchaseRepository.findOne({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (
      !purchase &&
      (purchase.orderStatus === PURCHASE_STATUS.CREATED ||
        purchase.orderStatus === PURCHASE_STATUS.AWAITING_PAYMENT)
    ) {
      throw new BadRequestException(PURCHASE_ERROR.PURCHASE_NOT_FOUND);
    }

    const amount = (+purchase.price + +purchase.shippingPrice).toFixed(2);
    const currency = 'RUB';
    const testMode = 1;
    const signature = md5(
      PayAnyWayConfig.MNT_ID +
        purchase.orderNumber +
        amount +
        currency +
        user.id +
        testMode +
        PayAnyWayConfig.MNT_INTEGRITY_CODE,
    );
    const url =
      PayAnyWayConfig.PAY_URL +
      `MNT_ID=` +
      PayAnyWayConfig.MNT_ID +
      `&MNT_AMOUNT=` +
      amount +
      `&MNT_TRANSACTION_ID=` +
      purchase.orderNumber +
      `&MNT_CURRENCY_CODE=` +
      currency +
      `&MNT_TEST_MODE=` +
      testMode +
      `&MNT_SUBSCRIBER_ID=` +
      user.id +
      `&MNT_SIGNATURE=` +
      signature;

    return url;
  }
  async successLink(orderNumber: string) {
    let purchase = await this.purchaseRepository.findOne({
      where: { orderNumber: orderNumber },
    });
    if (!purchase) {
      throw new Error('Не найдена покупка');
    }
    if (purchase.orderStatus === PURCHASE_STATUS.PAID) {
      return ClientConfig.successPay;
    }
    try {
      purchase = await this.purchaseRepository.getAllForEmail(purchase.id);
      for (const purchaseProduct of purchase.purchaseProducts) {
        if (purchaseProduct.type === 0) {
          const expired = new Date();
          expired.setMonth(expired.getMonth() + 6);
          purchaseProduct.expiredDate = expired;
          await purchaseProduct.save();
        }
      }

      if (purchase.deliveryType === DELIVERY_TYPE.CDEK_COURIER) {
        const { items, amount } = purchase.purchaseProducts.reduce(
          (acc, item) => {
            if (item.type === 2 || item.type === 3) {
              acc.amount += +item.totalCount;
              const count = +item.totalCount;

              acc.items.push({
                ware_key: '00055',
                payment: { value: 0 },
                name: purchase.id,
                cost: 300,
                amount: count,
                weight: count * SdekConfig.weight,
                url: 'https://www.laforme-patterns.com/',
              });
            }
            return acc;
          },
          { items: [], amount: 0 },
        );
        await this.sdekService.createOrder({
          tariff_code: purchase.cdekTariffCode,
          to_location: {
            address: purchase.address,
          },
          recipient: {
            name: [purchase.firstName, purchase.lastName].join(' '),
            phones: [
              {
                number: purchase.phone,
              },
            ],
          },
          packages: [
            {
              number: purchase.orderNumber,
              height: SdekConfig.height,
              length: SdekConfig.length,
              weight: SdekConfig.weight * amount,
              width: SdekConfig.width,
              items: items,
            },
          ],
        });
      }

      if (purchase.deliveryType === DELIVERY_TYPE.CDEK_POINT) {
        const { items, amount } = purchase.purchaseProducts.reduce(
          (acc, item) => {
            if (item.type === 2 || item.type === 3) {
              acc.amount += +item.totalCount;
              const count = +item.totalCount;

              acc.items.push({
                ware_key: '00055',
                payment: { value: 0 },
                name: purchase.id,
                cost: 300,
                amount: count,
                weight: count * SdekConfig.weight,
                url: 'https://www.laforme-patterns.com/',
              });
            }
            return acc;
          },
          { items: [], amount: 0 },
        );
        await this.sdekService.createOrder({
          tariff_code: purchase.cdekTariffCode,
          delivery_point: purchase.cdekPointCode,
          recipient: {
            name: [purchase.firstName, purchase.lastName].join(' '),
            phones: [
              {
                number: purchase.phone,
              },
            ],
          },
          packages: [
            {
              number: purchase.orderNumber,
              height: SdekConfig.height,
              length: SdekConfig.length,
              weight: SdekConfig.weight * amount,
              width: SdekConfig.width,
              items: items,
            },
          ],
        });
      }

      purchase.orderStatus = PURCHASE_STATUS.PAID;
      await purchase.save();
      await this.purchaseUtils.sendPurchaseInfo(purchase);
      return ClientConfig.successPay;
    } catch (error) {
      console.log('ошибка success');
      return ClientConfig.failPay;
    }
  }
}
