import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  Req,
  Res,
  UsePipes,
  UseFilters,
  Param,
  Put,
  Request,
} from '@nestjs/common';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetAccount } from '../user/decorator/get-account.decorator';
import { UserEntity } from '../user/user.entity';
import { AccountGuard } from '../user/guard/account.guard';
import { AccessToken } from './dto/accsess-token.dto';
import { ClientConfig } from '../../config/client.config';
import { AuthBasketForCodeDto } from './dto/auth-basket-code.dto';
import { ViewAuthFilter } from '../user/guard/auth.filter';
import { UpdateEmail } from './dto/user-update-email.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/signup')
  signUp(@Body() userSignUpDto: UserSignUpDto): Promise<AccessToken> {
    return this.authService.signUp(userSignUpDto);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/login')
  logIn(@Body() userLoginDto: UserLoginDto): Promise<AccessToken> {
    return this.authService.login(userLoginDto);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Put('/update-email')
  @UseGuards(AuthGuard(), AccountGuard)
  updateEmail(
    @GetAccount() user: UserEntity,
    @Body() body: UpdateEmail,
  ): Promise<AccessToken> {
    return this.authService.updateEmail(user, body);
  }

  @Get('/confirm-email/:code')
  @UseGuards(AuthGuard(), AccountGuard)
  confirmEmailByCode(
    @GetAccount() user: UserEntity,
    @Param('code') code: string,
  ): Promise<AccessToken> {
    return this.authService.confirmEmailByCode(user, code.toLowerCase());
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/verify/code')
  verifyByCode(@Body() body: AuthBasketForCodeDto): Promise<true> {
    return this.authService.authVerifyByCode(body);
  }

  // Соц редирект на авторизацию с сайта

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  googleRedirect() {}

  @UseGuards(AuthGuard('apple'))
  @Get('/apple')
  appleRedirect(@Request() req) {}

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookRedirect() {}

  // Соц сети ответ от сервисов

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  @UseFilters(ViewAuthFilter)
  async google(@Req() req, @Res() res) {
    const token = await this.authService.google(req.user);
    return res.redirect(
      `${ClientConfig.url}/auth/social-access?data=${token.accessToken}`,
    );
  }

  @UseGuards(AuthGuard('apple'))
  @Post('/apple/redirect')
  @UseFilters(ViewAuthFilter)
  async apple(@Req() req, @Res() res) {
    try {
      const token = await this.authService.apple(req.user);
      return res.redirect(
        `${ClientConfig.url}/auth/social-access?data=${token.accessToken}`,
      );
    } catch (error) {
      res.redirect(`${ClientConfig.url}/login/`);
    }
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  @UseFilters(ViewAuthFilter)
  facebook(@Req() req, @Res() res) {
    // const token = await this.authService.signUpWithFacebook(req.user);
    // return res.redirect(
    //   `${ClientConfig.url}/auth/social-access?data=${token.accessToken}`,
    // );
  }

  // Соц сети мобила

  @Post('/google/login')
  googleMobile(@Body() body) {
    return this.authService.googleMobile(body);
  }

  @Post('/apple/login')
  appleMobile(@Body() body) {
    return this.authService.appleMobile(body);
  }

  @Post('/apple/redirect/android')
  @UseFilters(ViewAuthFilter)
  appleRedirectMobile(@Body() body, @Res() res) {
    res.redirect(
      `intent://callback?code=${body.code}&id_token=${body.id_token}#Intent;package=com.laforme_patterns.android;scheme=signinwithapple;end`,
    );
  }
}

//TODO Неиспользуется но не факт вдруг на мобиле юзается

// import { UserInfoEntity } from '../../user-info/user-info.entity';

// export interface AccountDataDto {
//   id: number;
//   login: string;
//   email: string;
//   createDate: string;
//   emailConfirmed: boolean;
//   // userInfo: UserInfoEntity;
// }

// @Get('/token')
// @UseGuards(AuthGuard())
// checkToken(): void {}

// @Get('/account-data')
// @UseGuards(AuthGuard(), AccountGuard)
// getAccountData(@GetAccount() user: UserEntity): Promise<AccountDataDto> {
//   return this.authService.getAccountInfo(user);
// }

// @Delete('/delete/user')
// async deleteUser(@Query() query): Promise<void> {
//   return this.authService.deleteUser(query.id);
// }

// async getAccountInfo(user: UserEntity): Promise<AccountDataDto> {
//   const result = await this.userRepository.findOne(user.id, {
//     relations: ['userSettingId'],
//   });
//   return {
//     id: user.id,
//     login: user.login,
//     email: user.email,
//     emailConfirmed: user.emailConfirmed,
//     createDate: user.createDate,
//     // userInfo: result.userSettingId,
//   };
// }
// async deleteUser(id: number): Promise<any> {
//   const result = await this.userRepository.delete({ id });
//   if (!result) {
//     throw new BadRequestException(AUTH_ERROR.USER_NOT_FOUND);
//   }
//   return result;
// }
