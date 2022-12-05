import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
  Get,
  Query,
  Delete,
  Patch,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from '../user/guard/account.guard';
import { Roles } from '../user/decorator/role.decorator';
import { USER_ROLE } from '../user/enum/user-role.enum';
import { CategoryEntity } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { LangType } from 'src/common/enum/lang.enum';
import { LangValidationPipe } from 'src/common/guards/lang.guard';
import { ProductTypeEnum } from 'src/common/enum/type.enum';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post('/create')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async save(
    @Query(new LangValidationPipe()) lang: LangType,
    @Body(new ValidationPipe()) body: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    return await this.categoryService.create(body, lang);
  }

  @Get('get/:type')
  async getAll(
    @Query(new LangValidationPipe()) lang: LangType,
    @Param('type') type: ProductTypeEnum,
  ): Promise<CategoryEntity[]> {
    return await this.categoryService.getAll(type, lang);
  }

  @Get('get/:id')
  async getOne(
    @Query(new LangValidationPipe()) lang: LangType,
    @Param('id') id: string,
  ): Promise<CategoryEntity> {
    return await this.categoryService.getOne(id, lang);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Patch('update/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async update(@Param('id') id: string, @Body() body: any) {
    return await this.categoryService.update(id, body);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  async delete(@Param('id') id: string) {
    return await this.categoryService.delete(id);
  }
}
