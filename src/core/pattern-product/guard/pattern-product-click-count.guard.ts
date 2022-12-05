import { PatternProductRepository } from '../pattern-product.repository';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PatternProductClickCountGuard implements CanActivate {
  constructor(private patternProductRepository: PatternProductRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;

    const patternProduct = await this.patternProductRepository.findOne({
      where: { id: params.patternProductId },
    });
    await this.patternProductRepository.update(params.patternProductId, {
      clickCount: patternProduct.clickCount + 1,
    });
    return true;
  }
}
