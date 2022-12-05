import { EntityRepository, Repository } from 'typeorm';

import { RecommendationProductEntity } from './recommendation-product.entity';

@EntityRepository(RecommendationProductEntity)
export class RecommendationProductRepository extends Repository<RecommendationProductEntity> {}
