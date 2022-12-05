import { PipeTransform, BadRequestException } from '@nestjs/common';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PageValidationPipe implements PipeTransform {
  constructor(private takeOrOff: number | false = 30) {}

  transform(value: any) {
    const take = this.takeOrOff;

    if (take === false) {
      return { skip: undefined, take: undefined };
    }

    if (!value && value !== 0) {
      throw new BadRequestException();
    }

    if (isNaN(value)) {
      throw new BadRequestException();
    }

    if (value <= 0) {
      value = 1;
    }

    return { skip: (value >= 2 ? value - 1 : 0) * take, take: take };
  }
}

export class PaginationType {
  @IsNotEmpty()
  @IsNumber()
  skip!: number | undefined;

  @IsNotEmpty()
  @IsNumber()
  take!: number | undefined;
}
