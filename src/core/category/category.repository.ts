import { CategoryEntity } from './category.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { LangType } from 'src/common/enum/lang.enum';
import { InternalServerErrorException } from '@nestjs/common';
import { ProductTypeEnum } from 'src/common/enum/type.enum';

@EntityRepository(CategoryEntity)
export class CategoryRepository extends Repository<CategoryEntity> {
  async createCategory(
    body: CreateCategoryDto,
    lang: LangType,
  ): Promise<CategoryEntity> {
    const category = new CategoryEntity();

    category.type = body.type;

    if (lang === 'en') category.categoryNameEn = body.categoryName;
    else category.categoryNameRu = body.categoryName;

    try {
      return await category.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAll(
    type: ProductTypeEnum,
    lang: LangType,
  ): Promise<CategoryEntity[]> {
    const query = await this.createQueryBuilder('category');

    query.where('category.type = :type', { type: type });

    if (lang === 'en') query.andWhere('category.categoryNameEn is not null');
    else query.andWhere('category.categoryNameRu is not null');

    if (lang === 'en') query.select(['category.id', 'category.categoryNameEn']);
    else query.select(['category.id', 'category.categoryNameRu']);

    return await query.getMany();
  }

  async findOneCategory(id: string, lang: LangType): Promise<CategoryEntity> {
    const query = await this.createQueryBuilder('category');

    query.where('category.id = :id', { id });

    if (lang === 'en') query.select(['category.id', 'category.categoryNameEn']);
    else query.select(['category.id', 'category.categoryNameRu']);

    return await query.getOne();
  }
}
