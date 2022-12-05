import { PostGuard } from './guard/post.guard';
import { PostDto } from './dto/post.dto';
import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
  Get,
  Put,
  Query,
  Delete,
  DefaultValuePipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from '../user/guard/account.guard';
import { USER_ROLE } from '../user/enum/user-role.enum';
import { Roles } from '../user/decorator/role.decorator';
import { LangValidationPipe } from '../../common/guards/lang.guard';
import { GetAccount } from '../user/decorator/get-account.decorator';
import { UserEntity } from '../user/user.entity';
import { LangType } from 'src/common/enum/lang.enum';
import { PostClickCountGuard } from './guard/post-click-count.guard';
import {
  PageValidationPipe,
  PaginationType,
} from 'src/common/pipe/page-validation.pipe';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('/get/')
  getAll(
    @Query(new LangValidationPipe()) lang: LangType,
    @Query('page', new DefaultValuePipe(1), PageValidationPipe)
    { skip, take }: PaginationType,
    @Query('by') by: 'DESC' | 'ASC' = 'DESC',
    @Query('sort') sort: string = 'date',
    @Query('where') where: string,
    @Query('category') category: string,
    @Query('getAll') getAll: boolean,
  ) {
    return this.postService.getAll({
      lang,
      skip,
      take,
      sort,
      by,
      where,
      category,
      getAll,
    });
  }

  @Get('/auth/get/')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  getAllAuth(
    @Query(new LangValidationPipe()) lang: LangType,
    @Query('page', new DefaultValuePipe(1), PageValidationPipe)
    { skip, take }: PaginationType,
    @Query('by') by: 'DESC' | 'ASC' = 'DESC',
    @Query('sort') sort: string = 'date',
    @Query('where') where: string,
    @Query('category') category: string,
    @GetAccount() user: UserEntity,
  ) {
    return this.postService.getAll({
      lang,
      skip,
      take,
      sort,
      by,
      where,
      category,
      userId: user.id,
    });
  }

  @Get('/liked/get/')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  getLiked(
    @Query(new LangValidationPipe()) lang: LangType,
    @Query('page', new DefaultValuePipe(1), PageValidationPipe)
    { skip, take }: PaginationType,
    @Query('by') by: 'DESC' | 'ASC' = 'DESC',
    @Query('sort') sort: string = 'date',
    @Query('where') where: string,
    @Query('category') category: string,
    @GetAccount() user: UserEntity,
  ) {
    return this.postService.getLiked({
      lang,
      skip,
      take,
      sort,
      by,
      where,
      category,
      userId: user.id,
    });
  }

  @Get('/get/:postId')
  @UseGuards(PostGuard, PostClickCountGuard)
  getOne(@Param('postId') id: string) {
    return this.postService.getOne({ id });
  }

  @Get('/auth/get/:postId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, PostGuard, PostClickCountGuard)
  getOneAuth(@Param('postId') id: string, @GetAccount() user: UserEntity) {
    return this.postService.getOne({
      id,
      userId: user.id,
    });
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Get('/get/for-update/:postId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, PostGuard)
  getOneForAdmin(@Param('postId') id: string) {
    return this.postService.getOneForAdmin(id);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Post('/create/')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  save(@Body(new ValidationPipe()) body: PostDto) {
    return this.postService.create(body);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Put('/update/:postId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, PostGuard)
  update(@Param('postId') id: string, @Body() body: PostDto) {
    return this.postService.update(id, body);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Delete('/delete/:postId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, PostGuard)
  delete(@Param('postId') id: string) {
    return this.postService.delete(id);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Put('/disable/:postId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, PostGuard)
  disable(@Param('postId') id: string, @Body() body: { deleted: boolean }) {
    return this.postService.disable(id, body.deleted);
  }
}
