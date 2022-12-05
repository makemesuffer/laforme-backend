import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { SewingProductRepository } from '../sewing-product.repository';
import { SEWING_PRODUCT_ERROR } from '../enum/sewing-product.enum';

@Injectable()
export class SewingProductGuard implements CanActivate {
  constructor(private sewingProductRepository: SewingProductRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;

    if (!params.sewingProductId) {
      throw new BadRequestException();
    }

    const sewingProduct = await this.sewingProductRepository.findOne({
      where: { id: params.sewingProductId },
    });

    if (!sewingProduct) {
      throw new BadRequestException(
        SEWING_PRODUCT_ERROR.SEWING_PRODUCT_NOT_FOUND,
      );
    }
    return true;
  }
}
