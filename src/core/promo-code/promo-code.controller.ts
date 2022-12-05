import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
  Get,
  Delete,
} from '@nestjs/common';
import { PromoCodeEntity } from './promo-code.entity';
import { PromoCodeService } from './promo-code.service';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from '../user/guard/account.guard';
import { Roles } from '../user/decorator/role.decorator';
import { USER_ROLE } from '../user/enum/user-role.enum';

import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { CheckPromoCodeDto } from './dto/check-promo-code.dto';

@Controller('promo-code')
export class PromoCodeController {
  constructor(private readonly promoCodeService: PromoCodeService) {}

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post('/create')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  create(
    @Body(ValidationPipe) createPromoCodeDto: CreatePromoCodeDto,
  ): Promise<void> {
    return this.promoCodeService.create(createPromoCodeDto);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Get('/get')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  getAll(): Promise<PromoCodeEntity[]> {
    return this.promoCodeService.get();
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Delete('/delete')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  delete(@Body(ValidationPipe) body: { id: string }): Promise<void> {
    return this.promoCodeService.delete(body);
  }

  @Post('/check')
  check(@Body(ValidationPipe) checkPromoCodeDto: CheckPromoCodeDto) {
    return this.promoCodeService.check(checkPromoCodeDto);
  }
}
