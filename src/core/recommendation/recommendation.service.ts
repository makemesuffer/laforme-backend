import { Injectable } from '@nestjs/common';
import { RecommendationEntity } from './recommendation.entity';
import { RecommendationRepository } from './recommendation.repository';

@Injectable()
export class RecommendationService {
  constructor(private recommendationRepository: RecommendationRepository) {}

  async update(id: string, body: any) {
    const recommendations: RecommendationEntity =
      await this.recommendationRepository.findOneOrFail(id);
    Object.assign(recommendations, { ...body });

    return await this.recommendationRepository.save(recommendations);
  }

  async delete(id: string): Promise<any> {
    return await this.recommendationRepository.delete(id);
  }
}
