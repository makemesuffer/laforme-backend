import { MasterClassRepository } from './../master-class.repository';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { MASTER_CLASS_ERROR } from '../enum/master-class.enum';

@Injectable()
export class MasterClassGuard implements CanActivate {
  constructor(private masterClassRepository: MasterClassRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;

    if (!params.masterClassId) {
      throw new BadRequestException();
    }

    const masterClass = await this.masterClassRepository.findOne({
      where: { id: params.masterClassId },
    });

    if (!masterClass) {
      throw new BadRequestException(MASTER_CLASS_ERROR.MASTER_CLASS_NOT_FOUND);
    }
    return true;
  }
}
