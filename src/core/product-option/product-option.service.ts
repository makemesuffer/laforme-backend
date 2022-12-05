import { BadRequestException, Injectable } from '@nestjs/common';
import { PRODUCT_OPTION } from './enum/product-option.enum';
import { ProductOptionEntity } from './product-option.entity';
import { ProductOptionRepository } from './product-option.repository';

@Injectable()
export class ProductOptionService {
  constructor(private productOptionRepository: ProductOptionRepository) {}

  async getAll(): Promise<ProductOptionEntity[]> {
    return await this.productOptionRepository.find();
  }

  async update(id: string, body) {
    const result = await this.productOptionRepository.update(id, body);
    return result;
  }

  async delete(id: string): Promise<void> {
    const result = this.productOptionRepository.findOne(id);
    if (!result) {
      throw new BadRequestException(PRODUCT_OPTION.NOT_FOUND);
    } else await this.productOptionRepository.delete(id);
  }
}
