import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
  Get,
  Put,
  Query,
  Request,
  Param,
  UsePipes,
  BadRequestException,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PURCHASE_STATUS } from './enum/purchase.status';
import { GetUser } from './../user/decorator/get-account.decorator';
import { PurchaseGuard } from './guard/purchase.guard';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { PurchaseService } from './purchase.service';
import { AccountGuard } from '../user/guard/account.guard';
import { USER_ROLE } from '../user/enum/user-role.enum';
import { Roles } from '../user/decorator/role.decorator';
import { UserEntity } from '../user/user.entity';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import {
  PageValidationPipe,
  PaginationType,
} from 'src/common/pipe/page-validation.pipe';

@Controller('purchase')
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/not-auth/create')
  createAndSingUp(@Body(new ValidationPipe()) body: CreatePurchaseDto) {
    return this.purchaseService.createAndSignUp(body);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN, USER_ROLE.USER)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/create')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  create(@GetUser() user: UserEntity, @Body() body: CreatePurchaseDto) {
    return this.purchaseService.create(body, user);
  }

  @Roles(USER_ROLE.USER)
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  @Get('/open/:id')
  async openFiles(@GetUser() user: UserEntity, @Param('id') id) {
    try {
      // let stream = new Duplex();
      const files = await this.purchaseService.openFiles(user, id);
      const open = require('open');
      // stream.push(result);
      // stream.push(result);
      // stream.push(null);
      // console.log(stream);
      // if (
      //   fileType === 'ZIP' ||
      //   fileType === 'zip' ||
      //   fileType === 'pdf' ||
      //   fileType === 'PDF'
      // ) {
      //   res.header('Content-type', 'application/' + fileType); // если пдф
      // }
      // return stream.pipe(res).pipe(res);
      //

      for (let f of files) {
        open(f.fileUrl);
      }
    } catch (e) {
      throw new BadRequestException('Ошибка сервера');
    }
  }

  @Roles(USER_ROLE.SUPER)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Put('update/:purchaseId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, PurchaseGuard)
  update(@Body() body: UpdatePurchaseDto, @Request() req) {
    return this.purchaseService.update(req.purchaseId, body);
  }

  @Roles(USER_ROLE.SUPER)
  @Get('/get/')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  getAll(
    @Query('page', new DefaultValuePipe(1), new PageValidationPipe(10))
    { skip, take }: PaginationType,
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Query('status') status: PURCHASE_STATUS,
    @Query('orderNumber') orderNumber: string,
  ) {
    return this.purchaseService.getAll(
      take,
      skip,
      from,
      to,
      status,
      orderNumber,
    );
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN, USER_ROLE.USER)
  @Get('/user/get/')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  getAllForUser(
    @GetUser() user: UserEntity,
    @Query('page', new DefaultValuePipe(1), new PageValidationPipe(10))
    { skip, take }: PaginationType,
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Query('status') status: PURCHASE_STATUS,
    @Query('orderNumber') orderNumber: string,
  ) {
    return this.purchaseService.getAllForUser(
      take,
      skip,
      from,
      to,
      status,
      orderNumber,
      user.id,
    );
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN, USER_ROLE.USER)
  @Get('/get/:purchaseId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, PurchaseGuard)
  getOne(@Param('purchaseId') purchaseId: string) {
    return this.purchaseService.getOne(purchaseId);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN, USER_ROLE.USER)
  @Get('/user/get/:purchaseId')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  getOneForUser(
    @GetUser() user: UserEntity,
    @Param('purchaseId') purchaseId: string,
  ) {
    return this.purchaseService.getOneForUser(purchaseId, user.id);
  }

  @Get('/user/get/master-class/:purchaseId')
  getOnePaymentMasterClass(@Param('purchaseId') purchaseId: string) {
    return this.purchaseService.getOnePaymentMasterClass(purchaseId);
  }
}
