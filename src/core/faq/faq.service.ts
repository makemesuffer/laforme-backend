import { Injectable } from '@nestjs/common';
import { FaqEntity } from './faq.entity';
import { FaqRepository } from './faq.repository';
import { FaqDatato } from './dto/faq.dto';

@Injectable()
export class FaqService {
  constructor(private faqRepository: FaqRepository) {}

  async get(name: string): Promise<FaqEntity> {
    return await this.faqRepository.findOne({ name: name });
  }

  async save(body: FaqDatato, name: string): Promise<void> {
    const faqData = await this.faqRepository.findOne({ name: name });
    if (Boolean(faqData)) {
      await this.faqRepository.update(faqData.id, { data: body.data });
    } else {
      await this.faqRepository.save({ name: name, data: body.data });
    }
  }
}
