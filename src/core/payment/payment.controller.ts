import {
  Controller,
  Get,
  Query,
  UseGuards,
  Post,
  Body,
  Res,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from '../user/guard/account.guard';
import { PaymentService } from './payment.service';
import { GetUser } from '../user/decorator/get-account.decorator';
import { UserEntity } from '../user/user.entity';
import { Roles } from '../user/decorator/role.decorator';
import { USER_ROLE } from '../user/enum/user-role.enum';
import { PaymentDto } from './dto/payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN, USER_ROLE.USER)
  @Post('link/')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  GetUnitpayLink(
    @GetUser() user: UserEntity,
    @Body() body: PaymentDto,
  ): Promise<string> {
    return this.paymentService.getPayAnyWayLink(body, user);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN, USER_ROLE.USER)
  @Get('link/:purchaseId')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  GetPayAnyWayLinkByPurchaseId(
    @GetUser() user: UserEntity,
    @Param('purchaseId') purchaseId: string,
  ): Promise<any> {
    return this.paymentService.getPayAnyWayLinkByPurchaseId(purchaseId, user);
  }

  @Get('redirect')
  async paymentRedirect(
    @Res() res,
    @Query('MNT_TRANSACTION_ID') orderNumber: string,
    @Query('MNT_ID') MNT_ID: number,
    @Query('MNT_OPERATION_ID') MNT_OPERATION_ID: number,
  ) {
    const link = await this.paymentService.successLink(orderNumber);
    res.redirect(link);
  }
}
