import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  Patch,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetAccount } from '../user/decorator/get-account.decorator';
import { AccountGuard } from '../user/guard/account.guard';
import { UserEntity } from '../user/user.entity';
import { UserService } from './user.service';
import { UserGetEmailDto } from './dto/user-get-email.dto';
import { USER_ROLE } from './enum/user-role.enum';
import { Roles } from './decorator/role.decorator';
import { UserGetInfoDto } from './dto/user-get-info.dto';
import { UserUpdateInfoDto } from './dto/user-update-info.dto';
import {
  PageValidationPipe,
  PaginationType,
} from 'src/common/pipe/page-validation.pipe';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/get/info')
  @UseGuards(AuthGuard(), AccountGuard)
  async getUserInfo(@GetAccount() user: UserEntity): Promise<UserGetInfoDto> {
    return await this.userService.getUserInfo(user);
  }

  @Patch('/update/info')
  @UseGuards(AuthGuard(), AccountGuard)
  updateUserInfo(
    @GetAccount() user: UserEntity,
    @Body(ValidationPipe) body: UserUpdateInfoDto,
  ): Promise<void> {
    return this.userService.updateUserInfo(user, body);
  }

  @Get('/email')
  @UseGuards(AuthGuard(), AccountGuard)
  getUserEmail(@GetAccount() user: UserEntity): Promise<UserGetEmailDto> {
    return this.userService.getUserEmail(user);
  }

  @Roles(USER_ROLE.SUPER)
  @Get('get/')
  @UseGuards(AuthGuard(), AccountGuard)
  getAll(
    @Query('page', new DefaultValuePipe(1), new PageValidationPipe(false))
    { skip, take }: PaginationType,
    @Query('by') by: 'DESC' | 'ASC' = 'DESC',
    @Query('sort') sort: string = 'date',
    @Query('where') where: string,
    @Query('role') role: USER_ROLE,
  ) {
    return this.userService.getAll({
      skip,
      take,
      by,
      sort,
      where,
      role,
    });
  }

  @Roles(USER_ROLE.SUPER)
  @Get('get/:userId')
  @UseGuards(AuthGuard(), AccountGuard)
  getProfile(@Param('userId') userId: number) {
    return this.userService.getProfile(userId);
  }

  @Roles(USER_ROLE.SUPER)
  @Put('update/:userId')
  @UseGuards(AuthGuard(), AccountGuard)
  updateOne(@Param('userId') userId: number, @Body() body: any) {
    return this.userService.updateOne(userId, body);
  }

  @Get('/subscribe-status')
  @UseGuards(AuthGuard(), AccountGuard)
  getNotificationEmailStatus(@GetAccount() user: UserEntity) {
    return user.notificationEmail;
  }

  @Patch('/subscribe-update')
  @UseGuards(AuthGuard(), AccountGuard)
  updateSubscribeStatus(
    @GetAccount() user: UserEntity,
    @Body() body: { notificationEmail: boolean },
  ) {
    return this.userService.updateSubscribe(user.id, body);
  }

  @Put('/unsubscribe')
  unsubscribe(@Query('code') code: string) {
    return this.userService.unsubscribe(code);
  }
}
