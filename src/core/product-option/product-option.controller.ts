import { Controller, Param, UseGuards, Get, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from '../user/guard/account.guard';
import { Roles } from '../user/decorator/role.decorator';
import { USER_ROLE } from '../user/enum/user-role.enum';
import { ProductOptionService } from './product-option.service';

@Controller('product-option')
export class ProductOptionController {
  constructor(private productOptionService: ProductOptionService) {}

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Get('get/')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  getAll() {
    return this.productOptionService.getAll();
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  delete(@Param('id') id: string) {
    return this.productOptionService.delete(id);
  }
}
