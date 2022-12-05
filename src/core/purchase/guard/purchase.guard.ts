import { PurchaseRepository } from '../purchase.repository';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { PURCHASE_ERROR } from '../enum/purchase.enum';

@Injectable()
export class PurchaseGuard implements CanActivate {
  constructor(private purchaseRepository: PurchaseRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;

    if (!params.purchaseId) {
      throw new BadRequestException();
    }

    const purchase = await this.purchaseRepository.findOne({
      where: { id: params.purchaseId },
    });

    if (!purchase) {
      throw new BadRequestException(PURCHASE_ERROR.PURCHASE_NOT_FOUND);
    }

    request.purchaseId = params.purchaseId;

    return true;
  }
}
