import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../user/decorator/get-account.decorator';
import { Roles } from '../user/decorator/role.decorator';
import { USER_ROLE } from '../user/enum/user-role.enum';
import { AccountGuard } from '../user/guard/account.guard';
import { UserEntity } from '../user/user.entity';
import { MailFeedbackDto } from './dto/mail-feedback.dto';
import { MailDto } from './dto/mail.dto';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/notification')
  async notify(@Body() body: { subject: string; html: string }): Promise<any> {
    this.mailService.emitEvent(body);
    //return await 'ok';
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN, USER_ROLE.USER)
  @Post('/send-pdf')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async sendPdf(@GetUser() user: UserEntity, @Body() body): Promise<any> {
    return await this.mailService.sendPdf(user, body);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/send/verification-code')
  async sendVerificationCode(@Body() body: MailDto): Promise<any> {
    return await this.mailService.sendVerificationCode(body);
  }

  @Post('/send-feedback')
  async sendAdminFeedback(
    @Body(new ValidationPipe()) body: MailFeedbackDto,
  ): Promise<any> {
    return await this.mailService.sendAdminFeedback(body);
  }
}
