import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
  Get,
  Delete,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from '../user/guard/account.guard';
import { Roles } from '../user/decorator/role.decorator';
import { USER_ROLE } from '../user/enum/user-role.enum';
import { FooterEntity } from './footer.entity';
import { FooterService } from './footer.service';
import { FooterDto } from './dto/footer.dto';

@Controller('footer')
export class FooterController {
  constructor(private readonly footerService: FooterService) {}

  @Get('get/:id')
  getOne(@Param('id') id: string): Promise<FooterEntity> {
    return this.footerService.getOne(id);
  }

  @Get('get/')
  getAll(): Promise<FooterEntity[]> {
    return this.footerService.getAll();
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post('/save')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  save(@Body(new ValidationPipe()) body: FooterDto): Promise<FooterEntity> {
    return this.footerService.createOrUpate(body);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Patch('update/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  update(@Param('id') id: string, @Body() body: FooterDto) {
    return this.footerService.update(id, body);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  delete(@Param('id') id: string) {
    return this.footerService.delete(id);
  }
}
