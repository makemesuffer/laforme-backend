import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
  Get,
  Put,
  Query,
  Delete,
  Param,
  DefaultValuePipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from '../user/guard/account.guard';
import { Roles } from '../user/decorator/role.decorator';
import { USER_ROLE } from '../user/enum/user-role.enum';
import { PatternProductService } from './pattern-product.service';
import { PatternProductGuard } from './guard/pattern-product.guard';
import { LangValidationPipe } from 'src/common/guards/lang.guard';
import { PatternProductDto } from './dto/pattern-product.dto';
import { GetAccount } from '../user/decorator/get-account.decorator';
import { UserEntity } from '../user/user.entity';
import { LangType } from 'src/common/enum/lang.enum';
import { PatternProductClickCountGuard } from './guard/pattern-product-click-count.guard';
import {
  PageValidationPipe,
  PaginationType,
} from 'src/common/pipe/page-validation.pipe';

@Controller('pattern-product')
export class PatternProductController {
  constructor(private patternProductService: PatternProductService) {}

  @Get('/get/')
  getAll(
    @Query(new LangValidationPipe()) lang: LangType,
    @Query('page', new DefaultValuePipe(1), PageValidationPipe)
    { skip, take }: PaginationType,
    @Query('by') by: 'DESC' | 'ASC' = 'DESC',
    @Query('sort') sort: string = 'date',
    @Query('where') where: string,
    @Query('type') type: 'printed' | 'electronic',
    @Query('category') category: string,
    @Query('getAll') getAll: boolean,
  ) {
    return this.patternProductService.getAll({
      lang,
      skip,
      take,
      sort,
      by,
      where,
      type,
      category,
      getAll,
    });
  }

  @Get('/auth/get/')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  getAllAuth(
    @Query(new LangValidationPipe()) lang: LangType,
    @Query('page', new DefaultValuePipe(1), PageValidationPipe)
    { skip, take }: PaginationType,
    @Query('by') by: 'DESC' | 'ASC' = 'DESC',
    @Query('sort') sort: string = 'date',
    @Query('where') where: string,
    @Query('type') type: 'printed' | 'electronic' | '',
    @Query('category') category: string,
    @GetAccount() user: UserEntity,
  ) {
    return this.patternProductService.getAll({
      lang,
      skip,
      take,
      sort,
      by,
      where,
      type,
      category,
      userId: user.id,
    });
  }

  @Get('/liked/get/')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  getLiked(
    @Query(new LangValidationPipe()) lang: LangType,
    @Query('page', new DefaultValuePipe(1), PageValidationPipe)
    { skip, take }: PaginationType,
    @Query('by') by: 'DESC' | 'ASC' = 'DESC',
    @Query('sort') sort: string = 'date',
    @Query('where') where: string,
    @Query('type') type: 'printed' | 'electronic' | '',
    @Query('category') category: string,
    @GetAccount() user: UserEntity,
  ) {
    return this.patternProductService.getLiked({
      lang,
      skip,
      take,
      sort,
      by,
      where,
      type,
      category,
      userId: user.id,
    });
  }

  @Get('/get/:patternProductId')
  @UseGuards(PatternProductGuard, PatternProductClickCountGuard)
  getOne(@Param('patternProductId') id: string) {
    return this.patternProductService.getOne({
      id,
    });
  }

  @Get('/auth/get/:patternProductId')
  @UseGuards(
    AuthGuard('jwt'),
    AccountGuard,
    PatternProductGuard,
    PatternProductClickCountGuard,
  )
  getOneAuth(
    @Param('patternProductId') id: string,
    @GetAccount() user: UserEntity,
  ) {
    return this.patternProductService.getOne({
      id,
      userId: user.id,
    });
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Get('/get/for-update/:patternProductId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, PatternProductGuard)
  getOneForUpdate(@Param('patternProductId') id: string) {
    return this.patternProductService.getOneForUpdate(id);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post('/create/')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  save(@Body(new ValidationPipe()) body: PatternProductDto) {
    return this.patternProductService.create(body);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Put('/update/:patternProductId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, PatternProductGuard)
  update(
    @Param('patternProductId') id: string,
    @Body() body: PatternProductDto,
  ) {
    return this.patternProductService.update(id, body);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Delete('/delete/:patternProductId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, PatternProductGuard)
  delete(@Param('patternProductId') id: string) {
    return this.patternProductService.delete(id);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Put('/disable/:patternProductId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, PatternProductGuard)
  disable(
    @Param('patternProductId') id: string,
    @Body() body: { deleted: boolean },
  ) {
    return this.patternProductService.disable(id, body.deleted);
  }
}
