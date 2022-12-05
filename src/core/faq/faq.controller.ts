import {
  Controller,
  Post,
  UseGuards,
  Get,
  Body,
  Param,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from '../user/guard/account.guard';
import { Roles } from '../user/decorator/role.decorator';
import { USER_ROLE } from '../user/enum/user-role.enum';
import { FaqService } from './faq.service';
import { FaqDatato } from './dto/faq.dto';

@Controller('faq')
export class FaqController {
  constructor(private faqService: FaqService) {}

  @Get('/:name')
  get(@Param('name') name: string) {
    return this.faqService.get(name.trim().toLocaleLowerCase());
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post('/:name')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  save(@Body(ValidationPipe) body: FaqDatato, @Param('name') name: string) {
    return this.faqService.save(body, name.trim().toLocaleLowerCase());
  }
}
