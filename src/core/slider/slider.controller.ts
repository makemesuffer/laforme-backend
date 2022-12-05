import { SliderDto } from './dto/slider.dto';
import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
  Get,
  Put,
  Delete,
} from '@nestjs/common';
import { SliderService } from './slider.service';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from '../user/guard/account.guard';
import { Roles } from '../user/decorator/role.decorator';
import { USER_ROLE } from '../user/enum/user-role.enum';
import { SliderGuard } from './guard/slider.guard';
import { SliderEntity } from './slider.entity';

@Controller('slider')
export class SliderController {
  constructor(private readonly sliderService: SliderService) {}

  @Get('get/')
  getAll(): Promise<SliderEntity[]> {
    return this.sliderService.getAll();
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Get('get/:sliderId')
  @UseGuards(SliderGuard)
  getOne(@Param('sliderId') id: string): Promise<SliderEntity> {
    return this.sliderService.getOne(id);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post('/create')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  save(@Body(new ValidationPipe()) body: SliderDto) {
    return this.sliderService.create(body);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Put('update/:sliderId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, SliderGuard)
  update(@Param('sliderId') id: string, @Body() body: SliderDto) {
    return this.sliderService.update(id, body);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Delete('delete/:sliderId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, SliderGuard)
  delete(@Param('sliderId') id: string) {
    return this.sliderService.delete(id);
  }
}
