import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { SewingProductRepository } from '../sewing-product.repository';

@Injectable()
export class SewingProductClickCountGuard implements CanActivate {
  constructor(private sewingProductRepository: SewingProductRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;

    const sewingProduct = await this.sewingProductRepository.findOne({
      where: { id: params.sewingProductId },
    });

    await this.sewingProductRepository.update(params.sewingProductId, {
      clickCount: sewingProduct.clickCount + 1,
    });
    return true;
  }
}
