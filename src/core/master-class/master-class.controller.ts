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
import { MasterClassService } from './master-class.service';
import { MasterClassGuard } from './guard/master-class.guard';
import { LangValidationPipe } from 'src/common/guards/lang.guard';
import { MasterClassDto } from './dto/master-class.dto';
import { GetAccount } from '../user/decorator/get-account.decorator';
import { UserEntity } from '../user/user.entity';
import { LangType } from 'src/common/enum/lang.enum';
import { MasterClassClickCountGuard } from './guard/master-class-click-count.guard copy';
import {
  PageValidationPipe,
  PaginationType,
} from 'src/common/pipe/page-validation.pipe';

@Controller('master-class')
export class MasterClassController {
  constructor(private readonly masterClassService: MasterClassService) {}

  @Get('/get/')
  getAll(
    @Query(new LangValidationPipe()) lang: LangType,
    @Query('page', new DefaultValuePipe(1), PageValidationPipe)
    { skip, take }: PaginationType,
    @Query('by') by: 'DESC' | 'ASC' = 'DESC',
    @Query('sort') sort: string = 'date',
    @Query('where') where: string,
    @Query('category') category: string,
    @Query('getAll') getAll: boolean,
  ) {
    return this.masterClassService.getAll({
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
    @Query('page', new DefaultValuePipe(1), PageValidationPipe)
    { skip, take }: PaginationType,
    @Query('by') by: 'DESC' | 'ASC' = 'DESC',
    @Query('sort') sort: string = 'date',
    @Query('where') where: string,
    @Query('category') category: string,
    @GetAccount() user: UserEntity,
  ) {
    return this.masterClassService.getAll({
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
    @Query('page', new DefaultValuePipe(1), PageValidationPipe)
    { skip, take }: PaginationType,
    @Query('by') by: 'DESC' | 'ASC' = 'DESC',
    @Query('sort') sort: string = 'date',
    @Query('where') where: string,
    @Query('category') category: string,
    @GetAccount() user: UserEntity,
  ) {
    return this.masterClassService.getLiked({
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

  @Get('/get/:masterClassId')
  @UseGuards(MasterClassGuard, MasterClassClickCountGuard)
  getOne(@Param('masterClassId') id: string) {
    return this.masterClassService.getOne({
      id,
    });
  }

  @Get('/auth/get/:masterClassId')
  @UseGuards(
    AuthGuard('jwt'),
    AccountGuard,
    MasterClassGuard,
    MasterClassClickCountGuard,
  )
  getOneAuth(
    @Param('masterClassId') id: string,
    @GetAccount() user: UserEntity,
  ) {
    return this.masterClassService.getOne({
      id,
      userId: user.id,
    });
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Get('/get/for-update/:masterClassId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, MasterClassGuard)
  getOneForAdmin(@Param('masterClassId') id: string) {
    return this.masterClassService.getOneForAdmin(id);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post('/create/')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  save(@Body(new ValidationPipe()) body: MasterClassDto) {
    return this.masterClassService.save(body);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Put('/update/:masterClassId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, MasterClassGuard)
  update(
    @Param('masterClassId') masterClassId: string,
    @Body() body: MasterClassDto,
  ) {
    return this.masterClassService.update(masterClassId, body);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Delete('/delete/:masterClassId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, MasterClassGuard)
  delete(@Param('masterClassId') masterClassId: string) {
    return this.masterClassService.delete(masterClassId);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Put('/disable/:masterClassId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, MasterClassGuard)
  disable(
    @Param('masterClassId') masterClassId: string,
    @Body() body: { deleted: boolean },
  ) {
    return this.masterClassService.disable(masterClassId, body.deleted);
  }
}
