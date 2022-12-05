import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Query,
  UsePipes,
} from '@nestjs/common';
import { UserRecoveryService } from './user-recovery.service';
import { UserRecoveryDto } from './dto/user-recovery.dto';
import { UserRecoveryChangeCredentialsDto } from './dto/user-recovery-change-password.dto';

@Controller('user-recovery')
export class UserRecoveryController {
  constructor(private userRecoveryService: UserRecoveryService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/')
  sendRecoveryLinkToEmail(@Body() data: UserRecoveryDto): Promise<void> {
    return this.userRecoveryService.sendRecoveryLinkToEmail(data);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('change-password')
  changePassword(
    @Query('code') code: string,
    @Body() data: UserRecoveryChangeCredentialsDto,
  ): Promise<void> {
    return this.userRecoveryService.changePassword(code, data);
  }
}
