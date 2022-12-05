import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
  Get,
  Delete,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from '../user/guard/account.guard';
import { Roles } from '../user/decorator/role.decorator';
import { USER_ROLE } from '../user/enum/user-role.enum';
import { CompilationService } from './compilation.service';
import { CompilationDto } from './dto/compilation.dto';
import { UserEntity } from '../user/user.entity';
import { GetAccount } from '../user/decorator/get-account.decorator';
import { LangValidationPipe } from 'src/common/guards/lang.guard';
import { LangType } from 'src/common/enum/lang.enum';

@Controller('compilation')
export class CompilationController {
  constructor(private compilationService: CompilationService) {}

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post('/create/')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  create(@Body(new ValidationPipe()) body: CompilationDto[]) {
    return this.compilationService.create(body);
  }

  @Get('/get')
  getAll(@Query(new LangValidationPipe()) lang: LangType) {
    return this.compilationService.get(lang);
  }

  @Get('/auth/get')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  getAllAuth(
    @Query(new LangValidationPipe()) lang: LangType,
    @GetAccount() user: UserEntity,
  ) {
    return this.compilationService.get(lang, user.id);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Delete('/delete/:compilationId')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  delete(@Param('compilationId') id: string) {
    return this.compilationService.delete(id);
  }
}
