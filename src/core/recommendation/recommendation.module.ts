import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationEntity } from './recommendation.entity';
import { RecommendationRepository } from './recommendation.repository';
import { RecommendationService } from './recommendation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecommendationRepository, RecommendationEntity]),
  ],
  providers: [RecommendationService],
  exports: [RecommendationService],
})
export class RecommendationModule {}
