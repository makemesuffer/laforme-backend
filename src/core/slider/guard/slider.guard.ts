import { SliderRepository } from './../slider.repository';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { SLIDER_ERROR } from '../enum/slider.enum';

@Injectable()
export class SliderGuard implements CanActivate {
  constructor(private sliderRepository: SliderRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;

    if (!params.sliderId) {
      throw new BadRequestException();
    }

    const slider = await this.sliderRepository.findOne({
      where: { id: params.sliderId },
    });

    if (!slider) {
      throw new BadRequestException(SLIDER_ERROR.SLIDER_NOT_FOUND);
    }

    return true;
  }
}
