import { FooterEntity } from './footer.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(FooterEntity)
export class FooterRepository extends Repository<FooterEntity> {}
