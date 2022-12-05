import { EntityRepository, Repository } from 'typeorm';
import { ProductOptionEntity } from './product-option.entity';

@EntityRepository(ProductOptionEntity)
export class ProductOptionRepository extends Repository<ProductOptionEntity> {}
