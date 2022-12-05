import { FaqEntity } from './faq.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(FaqEntity)
export class FaqRepository extends Repository<FaqEntity> {}
