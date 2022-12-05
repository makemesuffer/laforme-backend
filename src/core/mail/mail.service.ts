import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Cache } from 'cache-manager';
import * as path from 'path';
import { UserEntity } from '../user/user.entity';
import { randomUUID } from 'src/common/utils/hash';
import { UserRepository } from '../user/user.repository';
import { MailDto } from './dto/mail.dto';
import { PurchaseEntity } from '../purchase/purchase.entity';
import { PURCHASE_STATUS_INFO } from '../purchase/enum/purchase.status';
import { USER_ROLE } from '../user/enum/user-role.enum';
import { generateAuthCode } from 'src/common/utils/generate-auth-code';
import { SendCodeForChangeDto } from './dto/send-code-for-change.dto';
import { MailFeedbackDto } from './dto/mail-feedback.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class MailService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly mailerService: MailerService,
    private userRepository: UserRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  private getTemplateLink(name: string) {
    return path.join(path.resolve(), `src/template/${name}.pug`);
  }

  // Письма связанные с аккаунтом пользователя

  async sendVerificationCodeToEmail(email: string, code: string) {
    return await this.mailerService
      .sendMail({
        to: email,
        subject: 'Код подтверждение регистрации',
        text: `Код подтверждения регистрации: ${code}`,
        template: this.getTemplateLink('verificate-email'),
        context: {
          code: code,
        },
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async sendCodeForChangeMail(data: SendCodeForChangeDto) {
    const { oldEmail, newEmail, codeOld, codeNew, emailConfirmed } = data;

    if (emailConfirmed) {
      await this.mailerService
        .sendMail({
          to: oldEmail,
          subject: 'Смена почты',
          text: `Код для смены почты на ${newEmail}: ${codeOld}`,
          template: this.getTemplateLink('change-mail'),
          context: {
            email: newEmail,
            code: codeOld,
          },
        })
        .catch((e) => {
          console.log(e);
        });
    }

    await this.mailerService
      .sendMail({
        to: newEmail,
        subject: 'Подтвердите почту',
        text: `Код для подтверждения почты: ${codeNew}`,
        template: path.join(path.resolve(), 'src/templates/change-mail-new'),
        context: {
          code: codeNew,
        },
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async sendRecoveryLinkToEmail(email: string, code: string) {
    return await this.mailerService
      .sendMail({
        to: email,
        subject: 'Восстаноление пароля',
        text: `Для смены пароля перейдите по ссылке https://www.laforme-patterns.com/auth/change-password?code=${code}`,
        template: this.getTemplateLink('recovery-account'),
        context: {
          code: code,
        },
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async sendVerificationCode(body: MailDto) {
    const code = generateAuthCode();
    await this.cacheManager.set(`AuthBasketEmailCodeFor${body.email}`, code);
    return await this.mailerService
      .sendMail({
        to: body.email,
        subject: 'Подтвердите почту для совершения покупки',
        text: `Подтвердите почту для совершения покупки`,
        template: this.getTemplateLink('confirm-email-for-order'),
        context: {
          code: code.toUpperCase(),
        },
      })
      .catch((e) => {
        console.log(e);
      });
  }

  // Письма связанные с корзиной

  async sendPurchaseInfo(purchase: PurchaseEntity) {
    return await this.mailerService
      .sendMail({
        to: purchase.email,
        subject: 'La`forme Patterns, информация о купленных продуктах',
        template: this.getTemplateLink('purchase-user-info'),
        context: {
          address: purchase.address,
          fullName: [purchase.firstName, purchase.lastName].join(' '),
          phone: purchase.phone,
          price: +purchase.price + (+purchase.shippingPrice ?? 0),
          shippingPrice: purchase.shippingPrice,
          purchasedProducts: purchase.purchaseProducts,
          orderNumber: purchase.orderNumber,
          orderStatus: PURCHASE_STATUS_INFO[purchase.orderStatus ?? 0],
          orderStatusNum: purchase.orderStatus ?? 0,
        },
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async sendAdminNewOrderInfo(purchase: PurchaseEntity) {
    const admins = await this.userRepository.getAdminsToNotificationNewOrder();
    if (!admins?.length) return;
    return await this.mailerService
      .sendMail({
        to: admins.map((item) => item.email),
        subject: 'La`forme Patterns, оформлен новый заказ',
        template: this.getTemplateLink('purchase-admin-info'),
        context: {
          orderId: purchase.id,
          email: purchase.email,
          address: purchase.address,
          fullName: [purchase.firstName, purchase.lastName].join(' '),
          phone: purchase.phone,
          price: +purchase.price + (+purchase.shippingPrice ?? 0),
          shippingPrice: purchase.shippingPrice,
          purchasedProducts: purchase.purchaseProducts,
          orderNumber: purchase.orderNumber,
          orderStatus: PURCHASE_STATUS_INFO[purchase.orderStatus ?? 0],
          orderStatusNum: purchase.orderStatus ?? 0,
          deliveryType: purchase.deliveryType,
        },
      })
      .catch((e) => console.log(e));
  }

  async sendUpdatedPurchaseInfo(email: string, purchase: PurchaseEntity) {
    return await this.mailerService
      .sendMail({
        to: email,
        subject: 'La`forme Patterns, статус покупки был обновлен',
        template: this.getTemplateLink('purchase-user-info'),
        context: {
          address: purchase.address,
          fullName: [purchase.firstName, purchase.lastName].join(' '),
          phone: purchase.phone,
          price: Number(purchase.price) + (Number(purchase.shippingPrice) || 0),
          shippingPrice: purchase.shippingPrice,
          purchasedProducts: purchase.purchaseProducts,
          orderNumber: purchase.orderNumber,
          orderStatus: PURCHASE_STATUS_INFO[purchase.orderStatus || 0],
          orderStatusNum: purchase.orderStatus || 0,
        },
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async sendUserInfo(email: string, password: string, login: string) {
    return await this.mailerService
      .sendMail({
        to: email,
        subject: 'La`forme Patterns, Информация об аккаунте',
        template: this.getTemplateLink('data-new-created-user-after-purchase'),
        context: {
          login: login,
          password: password,
        },
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async sendPdf(user: UserEntity, body) {
    return await this.mailerService
      .sendMail({
        to: user.email,
        subject: 'La`forme Patterns, скачивание pdf товара',
        template: this.getTemplateLink('purchase-product-file'),
        context: {
          name: body.productName,
          files: body.filesPdf,
        },
      })
      .catch((e) => {
        console.log(e);
      });
  }

  // Письма связанные с админом и рассылкой Отправить суперадмину и на Service@laforme.ru фидбек

  async sendAdminFeedback(body: MailFeedbackDto) {
    const [admins] = await this.userRepository.getAll({
      role: USER_ROLE.SUPER,
    });
    for (const user of admins) {
      await this.mailerService
        .sendMail({
          to: user.email,
          subject: 'La`forme Patterns, Обратная связь',
          template: this.getTemplateLink('feedback'),
          context: {
            description: body.description,
            email: body.email,
          },
        })
        .catch((e) => console.log(e));
    }
  }

  emitEvent(body) {
    this.eventEmitter.emit('msg.sent', body);
  }

  @OnEvent('msg.sent')
  async listentToEvent(body) {
    const users = await this.userRepository.getUsersForEmailNotification();
    for (const user of users) {
      const code = randomUUID();
      await this.cacheManager.set(code, JSON.stringify({ email: user.email }));
      await this.mailerService
        .sendMail({
          to: user.email,
          subject: body.subject,
          template: this.getTemplateLink('notification'),
          context: {
            htmlContent: body.html,
            code,
          },
        })
        .catch((e) => console.log(e));
    }
  }
  async sendNotification(body: { subject: string; html: string }) {
    const users = await this.userRepository.getUsersForEmailNotification();
    for (const user of users) {
      const code = randomUUID();
      await this.cacheManager.set(code, JSON.stringify({ email: user.email }));
      await this.mailerService
        .sendMail({
          to: user.email,
          subject: body.subject,
          template: this.getTemplateLink('notification'),
          context: {
            htmlContent: body.html,
            code,
          },
        })
        .catch((e) => console.log(e));
    }
  }
}
