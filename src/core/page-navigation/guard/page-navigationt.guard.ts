import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

import { PageNavigationRepository } from '../page-navigation.repository';

@Injectable()
export class PageNavigationGuard implements CanActivate {
  constructor(private pageNavigationRepository: PageNavigationRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;
    if (params.sewingProductId) {
      await this.pageNavigationRepository.save({
        sewingProductId: params.sewingProductId,
      });
    }
    if (params.masterClassId) {
      await this.pageNavigationRepository.save({
        masterClassId: params.masterClassId,
      });
    }
    if (params.patternProductId) {
      await this.pageNavigationRepository.save({
        patternProductId: params.patternProductId,
      });
    }
    return true;
  }
}
