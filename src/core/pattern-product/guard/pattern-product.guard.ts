import { PatternProductRepository } from '../pattern-product.repository';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { PATTERN_PRODUCT_ERROR } from '../enum/pattern-product.enum';

@Injectable()
export class PatternProductGuard implements CanActivate {
  constructor(private patternProductRepository: PatternProductRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;

    if (!params.patternProductId) {
      throw new BadRequestException();
    }

    const patternProduct = await this.patternProductRepository.findOne({
      where: { id: params.patternProductId },
    });

    if (!patternProduct) {
      throw new BadRequestException(
        PATTERN_PRODUCT_ERROR.PATTERN_PRODUCT_NOT_FOUND,
      );
    }

    request.patternProductId = params.patternProductId;
    return true;
  }
}
