import { UpdateSliderDto } from './dto/update-slider.dto';
import { SliderEntity } from './slider.entity';
import { Injectable } from '@nestjs/common';
import { SliderDto } from './dto/slider.dto';
import { SliderRepository } from './slider.repository';

@Injectable()
export class SliderService {
  constructor(private sliderRepository: SliderRepository) {}

  async getAll(): Promise<SliderEntity[]> {
    return await this.sliderRepository.findAll();
  }
  async getOne(id: string): Promise<SliderEntity> {
    return await this.sliderRepository.findOneSlide(id);
  }
  async create(body: SliderDto): Promise<SliderEntity> {
    return await this.sliderRepository.save(body);
  }
  async update(id: string, body: UpdateSliderDto) {
    return await this.sliderRepository.update(id, body);
  }
  async delete(id: string) {
    return await this.sliderRepository.delete(id);
  }
}
