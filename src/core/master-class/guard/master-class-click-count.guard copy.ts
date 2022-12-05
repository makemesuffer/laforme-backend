import { MasterClassRepository } from '../master-class.repository';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class MasterClassClickCountGuard implements CanActivate {
  constructor(private masterClassRepository: MasterClassRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;

    const masterClass = await this.masterClassRepository.findOne({
      where: { id: params.masterClassId },
    });

    await this.masterClassRepository.update(params.masterClassId, {
      clickCount: masterClass.clickCount + 1,
    });
    return true;
  }
}
