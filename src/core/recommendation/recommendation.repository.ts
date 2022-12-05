import { EntityRepository, Repository } from 'typeorm';
import { RecommendationEntity } from './recommendation.entity';

@EntityRepository(RecommendationEntity)
export class RecommendationRepository extends Repository<RecommendationEntity> {}
