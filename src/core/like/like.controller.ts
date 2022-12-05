import { UserEntity } from './../user/user.entity';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
  Get,
  Delete,
  Query,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from '../user/guard/account.guard';
import { Roles } from '../user/decorator/role.decorator';
import { USER_ROLE } from '../user/enum/user-role.enum';
import { GetUser } from '../user/decorator/get-account.decorator';
import { LikeDto } from './dto/like.dto';
import { LangValidationPipe } from 'src/common/guards/lang.guard';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN, USER_ROLE.USER)
  @Post('/create')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  save(@GetUser() user: UserEntity, @Body(new ValidationPipe()) body: LikeDto) {
    return this.likeService.create(body, user.id);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN, USER_ROLE.USER)
  @Get('/get/')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  getLikes(
    @Query(new LangValidationPipe()) query: string,
    @GetUser() user: UserEntity,
  ): Promise<any> {
    return this.likeService.getUserLikes(user.id, query);
  }

  @Roles(USER_ROLE.SUPER, USER_ROLE.ADMIN, USER_ROLE.USER)
  @Delete('/delete')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  delete(
    @GetUser() user: UserEntity,
    @Body(new ValidationPipe()) body: LikeDto,
  ): Promise<any> {
    return this.likeService.delete(body, user.id);
  }
}
