import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PromoCodeEntity } from './promo-code.entity';
import { PROMO_CODE_ERROR } from './enum/promo-code.enum';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { CheckPromoCodeDto } from './dto/check-promo-code.dto';

@Injectable()
export class PromoCodeService {
  constructor(
    @InjectRepository(PromoCodeEntity)
    private promoCodeRepository: Repository<PromoCodeEntity>,
  ) {}

  async create(body: CreatePromoCodeDto): Promise<void> {
    const result = await this.promoCodeRepository.findOne({
      text: body.text,
    });
    if (result) {
      throw new BadRequestException(PROMO_CODE_ERROR.PROMO_CODE_ALREADY_EXISTS);
    } else await this.promoCodeRepository.save({ ...body });
  }
  async get() {
    return await this.promoCodeRepository.find();
  }
  async delete(body: { id: string }) {
    const result = await this.promoCodeRepository.findOne({
      id: body.id,
    });
    if (!result) {
      throw new BadRequestException(PROMO_CODE_ERROR.PROMO_CODE_NOT_EXISTS);
    } else await this.promoCodeRepository.delete(result.id);
  }
  async check(body: CheckPromoCodeDto) {
    const result = await this.promoCodeRepository.findOne({
      text: body.text,
    });
    if (!result) {
      throw new BadRequestException(PROMO_CODE_ERROR.PROMO_CODE_NOT_EXISTS);
    }
    return { discount: result.discount, promocode: body.text };
  }

  async checkFromServer(
    promocode: string,
  ): Promise<{ promoCode?: string; discount?: number }> {
    const result = await this.promoCodeRepository.findOne({
      text: promocode,
    });
    return {
      promoCode: result?.text,
      discount: result?.discount,
    };
  }
}
