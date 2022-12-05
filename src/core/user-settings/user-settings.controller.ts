import {
  Controller,
  Patch,
  UseGuards,
  Body,
  ValidationPipe,
  UsePipes,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from '../user/guard/account.guard';
import { GetAccount } from '../user/decorator/get-account.decorator';
import { UserEntity } from '../user/user.entity';
import { UserSettingsUpdatePasswordDto } from './dto/user-settings-update-password.dto';
import { PasswordGuard } from './guard/password.guard';
import { UserSettingsService } from './user-settings.service';
import { UserSettingsUpdateEmailDto } from './dto/user-settings-update-email.dto';

@Controller('user/settings')
export class UserSettingsController {
  constructor(private userSettingsService: UserSettingsService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch('/password')
  @UseGuards(AuthGuard(), AccountGuard, PasswordGuard)
  updatePassword(
    @Body()
    userSettingsUpdatePasswordDto: UserSettingsUpdatePasswordDto,
    @GetAccount() user: UserEntity,
  ): Promise<void> {
    return this.userSettingsService.updatePassword(
      user,
      userSettingsUpdatePasswordDto,
    );
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch('/email')
  @UseGuards(AuthGuard(), AccountGuard, PasswordGuard)
  changeEmail(
    @GetAccount() user: UserEntity,
    @Body() data: UserSettingsUpdateEmailDto,
  ): Promise<void> {
    return this.userSettingsService.changeEmail(user, data);
  }

  @Get('/email')
  @UseGuards(AuthGuard(), AccountGuard)
  sendVerifCodeToEmail(@GetAccount() user: UserEntity): Promise<void> {
    return this.userSettingsService.sendVerifCodeToEmail(user);
  }
}
