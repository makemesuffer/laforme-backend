import { Injectable } from '@nestjs/common';
import { FooterDto } from './dto/footer.dto';
import { FooterEntity } from './footer.entity';
import { FooterRepository } from './footer.repository';

@Injectable()
export class FooterService {
  constructor(private footerRepository: FooterRepository) {}

  async createOrUpate(body: FooterDto): Promise<any> {
    const res = await this.footerRepository.find();
    if (Boolean(res.length)) {
      return await this.footerRepository.update(res[0].id, body);
    }
    return await this.footerRepository.save(body);
  }

  async getOne(id: string): Promise<FooterEntity> {
    return await this.footerRepository.findOne(id);
  }

  async getAll(): Promise<FooterEntity[]> {
    return await this.footerRepository.find();
  }

  async update(id: string, body: FooterDto) {
    return await this.footerRepository.update(id, body);
  }

  async delete(id: string): Promise<void> {
    await this.footerRepository.delete(id);
  }
}
