import { CategoryRepository } from './category.repository';
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryEntity } from './category.entity';
import { CATEGORY_ERROR } from './enum/category.enum';
import { LangType } from 'src/common/enum/lang.enum';
import { ProductTypeEnum } from 'src/common/enum/type.enum';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async create(
    body: CreateCategoryDto,
    lang: LangType,
  ): Promise<CategoryEntity> {
    if (body.type === 1 || body.type === 2) body.type === 2;

    const result = await this.categoryRepository.findOne({
      categoryNameRu: lang === 'ru' ? body.categoryName : undefined,
      categoryNameEn: lang === 'en' ? body.categoryName : undefined,
      type: body.type,
    });

    if (result) {
      throw new BadRequestException(CATEGORY_ERROR.CATEGORY_ALREADY_EXISTS);
    } else {
      return await this.categoryRepository.createCategory(body, lang);
    }
  }

  async getAll(
    type: ProductTypeEnum,
    lang: LangType,
  ): Promise<CategoryEntity[]> {
    if (+type === 1 || +type === 2) type = 2;

    return await this.categoryRepository.findAll(type, lang);
  }

  async getOne(id: string, lang: LangType): Promise<CategoryEntity> {
    return await this.categoryRepository.findOneCategory(id, lang);
  }

  async update(id: string, body) {
    const result = await this.categoryRepository.update(id, body);
    if (!result) {
      throw new BadRequestException(CATEGORY_ERROR.CATEGORY_NOT_FOUND);
    } else return await this.categoryRepository.findOne(id);
  }

  async delete(id: string): Promise<void> {
    const result = this.categoryRepository.findOne(id);
    if (!result) {
      throw new BadRequestException(CATEGORY_ERROR.CATEGORY_NOT_FOUND);
    } else {
      await this.categoryRepository.delete(id);
    }
  }
}
