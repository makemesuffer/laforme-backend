import {
  Controller,
  Post,
  Get,
  UseGuards,
  Body,
  Delete,
  ValidationPipe,
  Patch,
  Param,
  Res,
} from '@nestjs/common';
import { Readable } from 'stream';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from '../user/guard/account.guard';
import { USER_ROLE } from '../user/enum/user-role.enum';
import { Roles } from '../user/decorator/role.decorator';

import { CdekTariffListDto } from './dto/cdek-tarifflist';
import { CdekTariffCodeDto } from './dto/cdek-tariff-code';
import { CdekCreateOrderDto, CdekUpdateOrderDto } from './dto/cdek-order';
import { СdekPdfOrBarcodeDto } from './dto/сdek-pdf-barcode.dto';

import { SdekService } from './sdek.service';
import { CdekCourierDto } from './dto/cdek.courier.dto';

@Controller('sdek')
export class SdekController {
  constructor(private readonly sdekService: SdekService) {}

  @Roles(USER_ROLE.SUPER)
  @Get('/auth')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  authInSdek() {
    return this.sdekService.authInSdek();
  }

  @Get('/city-code/:kladr')
  getCityCodeByKladr(@Param('kladr') kladr: string) {
    return this.sdekService.getCityCodeByKladr(kladr);
  }

  @Post('/calculator/tarifflist')
  getTariffList(@Body(ValidationPipe) body: CdekTariffListDto) {
    return this.sdekService.getTariffList(body);
  }

  @Post('/calculator/tariff')
  сalculationByTariffCode(@Body(ValidationPipe) body: CdekTariffCodeDto) {
    return this.sdekService.сalculationByTariffCode(body);
  }

  @Post('/order/create')
  @Roles(USER_ROLE.SUPER)
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  createOrder(@Body(ValidationPipe) body: CdekCreateOrderDto) {
    return this.sdekService.createOrder(body);
  }
  @Get('/order/:orderId')
  @Roles(USER_ROLE.SUPER)
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  getOrder(@Param('orderId') orderId: string) {
    return this.sdekService.getOrder(orderId);
  }

  @Patch('/order/edit')
  @Roles(USER_ROLE.SUPER)
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  editOrder(@Body(ValidationPipe) body: CdekUpdateOrderDto) {
    return this.sdekService.editOrder(body);
  }

  @Delete('/order/delete/:orderId')
  @Roles(USER_ROLE.SUPER)
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  deleteOrder(@Param('orderId') orderId: string) {
    return this.sdekService.deleteOrder(orderId);
  }

  @Post('/order/pdf')
  @Roles(USER_ROLE.SUPER)
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async createPdfReceipt(
    @Body(ValidationPipe) body: СdekPdfOrBarcodeDto,
    @Res() res,
  ) {
    const stream = Readable.from(await this.sdekService.createPdfReceipt(body));
    stream.pipe(res);
  }

  @Post('/order/barcode')
  @Roles(USER_ROLE.SUPER)
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async createBarcode(
    @Body(ValidationPipe) body: СdekPdfOrBarcodeDto,
    @Res() res,
  ) {
    const stream = await this.sdekService.createBarcode(body);
    res.end(stream);
  }

  @Post('/order/courier')
  @Roles(USER_ROLE.SUPER)
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  createCourier(@Body(ValidationPipe) body: CdekCourierDto) {
    return this.sdekService.createCourier(body);
  }
}
