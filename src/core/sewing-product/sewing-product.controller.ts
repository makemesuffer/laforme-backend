import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
  Get,
  Put,
  Query,
  Delete,
  DefaultValuePipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from '../user/guard/account.guard';
import { Roles } from '../user/decorator/role.decorator';
import { USER_ROLE } from '../user/enum/user-role.enum';
import { SewingProductService } from './sewing-product.service';
import { SewingProductGuard } from './guard/sewing-product.guard';
import { LangValidationPipe } from 'src/common/guards/lang.guard';
import { SewingProductDto } from './dto/sewing-product.dto';
import { GetAccount } from '../user/decorator/get-account.decorator';
import { UserEntity } from '../user/user.entity';
import { LangType } from 'src/common/enum/lang.enum';
import { SewingProductClickCountGuard } from './guard/sewing-product-click-count.guard';
import {
  PageValidationPipe,
  PaginationType,
} from 'src/common/pipe/page-validation.pipe';

@Controller('sewing-product')
export class SewingProductController {
  constructor(private sewingProductService: SewingProductService) {}

  @Get('/get/')
  getAll(
    @Query(new LangValidationPipe()) lang: LangType,
    @Query('page', new DefaultValuePipe(1), new PageValidationPipe())
    { skip, take }: PaginationType,
    @Query('by') by: 'DESC' | 'ASC' = 'DESC',
    @Query('sort') sort: string = 'date',
    @Query('where') where: string,
    @Query('category') category: string,
    @Query('getAll') getAll: boolean,
  ) {
    return this.sewingProductService.getAll({
      lang,
      skip,
      take,
      sort,
      by,
      where,
      category,
      getAll,
    });
  }

  @Get('/auth/get/')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  getAllAuth(
    @Query(new LangValidationPipe()) lang: LangType,
    @Query('page', new DefaultValuePipe(1), new PageValidationPipe())
    { skip, take }: PaginationType,
    @Query('by') by: 'DESC' | 'ASC' = 'DESC',
    @Query('sort') sort: string = 'date',
    @Query('where') where: string,
    @Query('category') category: string,
    @GetAccount() user: UserEntity,
  ) {
    return this.sewingProductService.getAll({
      lang,
      skip,
      take,
      sort,
      by,
      where,
      category,
      userId: user.id,
    });
  }

  @Get('/liked/get/')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  getLiked(
    @Query(new LangValidationPipe()) lang: LangType,
    @Query('page', new DefaultValuePipe(1), new PageValidationPipe())
    { skip, take }: PaginationType,
    @Query('by') by: 'DESC' | 'ASC' = 'DESC',
    @Query('sort') sort: string = 'date',
    @Query('where') where: string,
    @Query('category') category: string,
    @GetAccount() user: UserEntity,
  ) {
    return this.sewingProductService.getLiked({
      lang,
      skip,
      take,
      sort,
      by,
      where,
      category,
      userId: user.id,
    });
  }

  @Get('/get/:sewingProductId')
  @UseGuards(SewingProductGuard, SewingProductClickCountGuard)
  getOne(@Param('sewingProductId') id: string) {
    return this.sewingProductService.getOne({ id });
  }

  @Get('/auth/get/:sewingProductId')
  @UseGuards(
    AuthGuard('jwt'),
    AccountGuard,
    SewingProductGuard,
    SewingProductClickCountGuard,
  )
  getOneAuth(
    @Param('sewingProductId') id: string,
    @GetAccount() user: UserEntity,
  ) {
    return this.sewingProductService.getOne({ id, userId: user.id });
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Get('/get/for-update/:sewingProductId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, SewingProductGuard)
  getOneForUpdate(@Param('sewingProductId') id: string) {
    return this.sewingProductService.getOneForUpdate(id);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post('/create/')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  save(@Body(new ValidationPipe()) body: SewingProductDto) {
    return this.sewingProductService.create(body);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Put('/update/:sewingProductId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, SewingProductGuard)
  update(
    @Param('sewingProductId') sewingProductId: string,
    @Body() body: SewingProductDto,
  ) {
    return this.sewingProductService.update(sewingProductId, body);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Put('/disable/:sewingProductId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, SewingProductGuard)
  disable(
    @Param('sewingProductId') sewingProductId: string,
    @Body() body: { deleted: boolean },
  ) {
    return this.sewingProductService.disable(sewingProductId, body.deleted);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Delete('/delete/:sewingProductId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, SewingProductGuard)
  delete(@Param('sewingProductId') sewingProductId: string) {
    return this.sewingProductService.delete(sewingProductId);
  }
}
