import { SliderEntity } from './slider.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(SliderEntity)
export class SliderRepository extends Repository<SliderEntity> {
  async findAll(): Promise<SliderEntity[]> {
    return await this.createQueryBuilder('slider')
      .leftJoin('slider.imageUrl', 'image_url')
      .select([
        'slider.id',
        'slider.headingTextRu',
        'slider.headingTextEn',
        'slider.buttonTextRu',
        'slider.buttonTextEn',
        'slider.buttonUrl',
        'slider.titleTextColor',
        'slider.buttonColor',
        'slider.buttonTextColor',
        'slider.isHaveButton',
        'image_url',
      ])
      .getMany();
  }

  async findOneSlide(id: string): Promise<SliderEntity> {
    return await this.createQueryBuilder('slider')
      .leftJoin('slider.imageUrl', 'image_url')
      .where('slider.id = :id', { id })
      .select([
        'slider.id',
        'slider.headingTextRu',
        'slider.headingTextEn',
        'slider.buttonTextRu',
        'slider.buttonTextEn',
        'slider.buttonUrl',
        'slider.titleTextColor',
        'slider.buttonColor',
        'slider.buttonTextColor',
        'slider.isHaveButton',
        'image_url',
      ])
      .getOne();
  }
}
