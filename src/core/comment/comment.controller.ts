import { SubCommentDto } from './dto/sub-comment.dto';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
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
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from '../user/guard/account.guard';
import { Roles } from '../user/decorator/role.decorator';
import { USER_ROLE } from '../user/enum/user-role.enum';
import { CommentEntity, SubCommentEntity } from './comment.entity';
import { GetUser } from '../user/decorator/get-account.decorator';
import { UserEntity } from '../user/user.entity';
import { CommentGuard } from './guard/comment.guard';
import { GetComment } from './decorator/get-comment.decorator';
import { GetSubComment } from './decorator/get-sub-comment.decorator';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { SubCommentGuard } from './guard/sub-comment.guard';
import {
  PageValidationPipe,
  PaginationType,
} from 'src/common/pipe/page-validation.pipe';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN, USER_ROLE.USER)
  @Post('/create')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  save(
    @GetUser() user: UserEntity,
    @Body(new ValidationPipe()) body: CommentDto,
  ) {
    return this.commentService.create(body, user.id);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN, USER_ROLE.USER)
  @Delete('delete/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  delete(@GetUser() user: UserEntity, @Param('id') id: string) {
    return this.commentService.delete(id, user);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN, USER_ROLE.USER)
  @Post('sub/create/')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  saveSub(
    @GetUser() user: UserEntity,
    @Body(new ValidationPipe()) body: SubCommentDto,
  ) {
    return this.commentService.createSub(body, user.id);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN, USER_ROLE.USER)
  @Delete('sub/delete/:id')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  deleteSub(@GetUser() user: UserEntity, @Param('id') id: string) {
    return this.commentService.deleteSub(id, user);
  }

  @Get('get/master-class/:id')
  getMasterClassComment(@Param('id') id: string): Promise<CommentEntity[]> {
    return this.commentService.getMasterClassComment(id);
  }

  @Get('get/pattern-product/:id')
  getPatternProductComment(@Param('id') id: string): Promise<CommentEntity[]> {
    return this.commentService.getPatternProductComment(id);
  }

  @Get('get/post/:id')
  getPostComment(@Param('id') id: string): Promise<CommentEntity[]> {
    return this.commentService.getPostComment(id);
  }
  @Get('get/sewing-product/:id')
  getSewingProductComment(@Param('id') id: string): Promise<CommentEntity[]> {
    return this.commentService.getSewingProductComment(id);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN, USER_ROLE.USER)
  @Patch('update/:commentId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, CommentGuard)
  update(
    @GetUser() user: UserEntity,
    @GetComment() comment: CommentEntity,
    @Body() body: UpdateCommentDto,
  ) {
    return this.commentService.update(user, comment, body);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN, USER_ROLE.USER)
  @Patch('sub/update/:subCommentId')
  @UseGuards(AuthGuard('jwt'), AccountGuard, SubCommentGuard)
  updateSub(
    @GetUser() user: UserEntity,
    @GetSubComment() subComment: SubCommentEntity,
    @Body() body: UpdateCommentDto,
  ) {
    return this.commentService.updateSub(user, subComment, body);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN, USER_ROLE.USER)
  @Get('get')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  getAll(@GetUser() user: UserEntity): Promise<CommentEntity[]> {
    return this.commentService.getAllUserComments(user.id);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN)
  @Get('get/for-admin')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  getAllForAdmin(
    @Query('page', new DefaultValuePipe(1), new PageValidationPipe())
    { skip, take }: PaginationType,
  ): Promise<[CommentEntity[], number]> {
    return this.commentService.getAllUserCommentsForAdmin(skip, take);
  }

  @Get('get/:id')
  getOne(@Param('id') id: string): Promise<CommentEntity> {
    return this.commentService.getOne(id);
  }
}
