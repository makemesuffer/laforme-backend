import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

import { StatisticType, StatisticError } from '../enum/statistic.enum';

@Injectable()
export class StatisticValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const statisticTypes = Object.values(StatisticType);
    const type = Number(value.type);
    const index = statisticTypes.indexOf(type);
    if (index === -1) {
      throw new BadRequestException(StatisticError.StatisticTypeNotFound);
    }
    return type;
  }
}
