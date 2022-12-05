import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GetUser } from '../user/decorator/get-account.decorator';
import { AccountGuard } from '../user/guard/account.guard';
import { UserEntity } from '../user/user.entity';

import { UserInfoDto } from './dto/user-info.dto';
import { UserInfoUpdateDto } from './dto/user-info-update.dto';
import { UserInfoService } from './user-info.service';
import { USER_ROLE } from '../user/enum/user-role.enum';
import { Roles } from '../user/decorator/role.decorator';
import { UserInfoEntity } from './user-info.entity';

@Controller('user/info')
export class UserInfoController {
  constructor(private userInfoService: UserInfoService) {}

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN, USER_ROLE.USER)
  @Get('/get')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  get(@GetUser() user: UserEntity): Promise<UserInfoEntity> {
    return this.userInfoService.findOneByUserId(user);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN, USER_ROLE.USER)
  @Patch('/update')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  updateUserDeliveryInfo(
    @GetUser() user: UserEntity,
    @Body(ValidationPipe) data: UserInfoUpdateDto,
  ): Promise<UserInfoDto> {
    return this.userInfoService.update(user, data);
  }
}
