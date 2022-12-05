import {
  Injectable,
  NotFoundException,
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { AUTH_ERROR } from './enum/auth-error.enum';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AccessToken } from './dto/accsess-token.dto';
import { JwtPayload } from './interface/jwt-payload.interface';
import { AuthRepository } from './auth.repository';
import { AuthBasketForCodeDto } from './dto/auth-basket-code.dto';
import {
  UpdateEmail,
  UserUpdateEmailRawDataDto,
} from './dto/user-update-email.dto';
import axios from 'axios';
import { GoogleUserData } from 'src/core/auth/interface/google-user-data';
import { AppleUserData } from 'src/core/auth/interface/apple-user-data';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  private async createJwt(user: UserEntity): Promise<AccessToken> {
    const { id, login, email, role, emailConfirmed, notificationEmail } = user;
    const payload: JwtPayload = {
      id,
      login,
      email,
      role,
      emailConfirmed,
      notificationEmail,
    };
    const token = this.jwtService.sign(payload);
    return { accessToken: token };
  }

  async signUp(userSignUpDto: UserSignUpDto): Promise<AccessToken> {
    const user = await this.userRepository.createUser(userSignUpDto);
    return await this.createJwt(user);
  }

  async login(userLoginDto: UserLoginDto): Promise<AccessToken> {
    const user = await this.authRepository.login(userLoginDto);
    return await this.createJwt(user);
  }

  async confirmEmailByCode(
    user: UserEntity,
    code: string,
  ): Promise<AccessToken> {
    const rawPayload: string = await this.cacheManager.get(user.email + code);

    if (!rawPayload) {
      throw new BadRequestException(AUTH_ERROR.WRONG_CODE);
    }

    const payload = JSON.parse(rawPayload);

    if (user.email !== payload.email) {
      throw new BadRequestException(AUTH_ERROR.WRONG_CODE);
    }

    await this.userRepository.confirmEmailById(user);
    await this.cacheManager.del(user.email + code);
    console.log(`${user.email} is confirmed by ${code}`);

    return await this.createJwt(user);
  }

  async authVerifyByCode(body: AuthBasketForCodeDto): Promise<true> {
    const codeResult: string = await this.cacheManager.get(
      `AuthBasketEmailCodeFor${body.email}`,
    );

    if (codeResult !== body.code) {
      throw new BadRequestException(AUTH_ERROR.WRONG_CODE);
    }

    return true;
  }

  async updateEmail(user: UserEntity, body: UpdateEmail): Promise<AccessToken> {
    if (!user.emailConfirmed) body.codeOldEmail = body.codeNewEmail;
    const oldRawData: string = await this.cacheManager.get(body.codeOldEmail);
    const newRawData: string = await this.cacheManager.get(body.codeNewEmail);
    if (!oldRawData) {
      throw new BadRequestException(AUTH_ERROR.WRONG_OLD_CODE);
    }
    if (!newRawData) {
      throw new BadRequestException(AUTH_ERROR.WRONG_NEW_CODE);
    }
    const newData: UserUpdateEmailRawDataDto = JSON.parse(newRawData);
    const oldData: UserUpdateEmailRawDataDto = JSON.parse(oldRawData);
    if (oldData.email !== newData.email) {
      throw new BadRequestException(AUTH_ERROR.WRONG_CODE);
    }
    try {
      await this.userRepository.update(user.id, { email: newData.email });
      await this.cacheManager.del(body.codeOldEmail);
      await this.cacheManager.del(body.codeNewEmail);
      user.email = newData.email;
      return await this.createJwt(user);
    } catch (err) {
      throw new BadRequestException();
    }
  }

  // Соц сайт

  async google(body: GoogleUserData): Promise<AccessToken> {
    try {
      let accessToken;
      const findUserByEmail = await this.userRepository.findOne({
        email: body.email,
      });

      if (findUserByEmail && !findUserByEmail.googleId) {
        findUserByEmail.googleId = body.id;
        await findUserByEmail.save();
      }

      const existUser = await this.userRepository.findOne({
        googleId: body.id,
      });

      if (existUser) {
        return await this.createJwt(existUser);
      } else {
        const user = await this.userRepository.saveGoogleUser({
          email: body.email,
          login: body.email.split('@')[0],
          googleId: body.id,
        });
        return await this.createJwt(user);
      }
      return { accessToken };
    } catch (error) {
      console.log(error);
    }
  }

  async apple(user: AppleUserData): Promise<AccessToken> {
    const { id, email, emailVerified } = user;

    if (!emailVerified) {
      throw new InternalServerErrorException('APPLE_ID_EMAIL_NOT_CONFIRMED');
    }

    const existUser = await this.userRepository.findOne({ email: email });

    if (existUser) {
      if (!existUser.appleId) {
        existUser.appleId = id;
        await existUser.save();
      }
      return await this.createJwt(existUser);
    } else {
      const user = await this.userRepository.saveAppleUser({
        email: email,
        login: email.split('@')[0],
        appleId: id,
      });
      return await this.createJwt(user);
    }
  }

  async facebook(body: any): Promise<AccessToken> {
    let accessToken;

    const findUserByEmail = await this.userRepository.findOne({
      email: body.email,
    });

    if (findUserByEmail && !findUserByEmail.facebookId) {
      findUserByEmail.facebookId = body.id;
      await findUserByEmail.save();
    }

    const existUser = await this.userRepository.findOne({
      facebookId: body.id,
    });

    if (existUser) {
      return await this.createJwt(existUser);
    } else {
      const user = await this.userRepository.saveFacebookUser({
        email: body.email,
        login: body.email.split('@')[0],
        facebookId: body.id,
      });
      return await this.createJwt(user);
    }

    return { accessToken };
  }

  // Соц сети мобила

  async googleMobile(body: any): Promise<AccessToken> {
    const response = await axios(
      'https://www.googleapis.com/oauth2/v1/tokeninfo',
      {
        params: {
          access_token: body.accessToken,
        },
      },
    );

    const googleData = response.data;

    if (googleData.error) {
      throw new BadRequestException();
    } else {
      const existUser = await this.userRepository.findOne({
        googleId: googleData.user_id,
      });

      if (existUser) {
        return await this.createJwt(existUser);
      } else {
        const user = await this.userRepository.saveGoogleUser({
          email: googleData.email,
          login:
            googleData.email.split('@')[0] +
            googleData.user_id[0] +
            googleData.user_id[1],
          googleId: googleData.user_id,
        });
        return await this.createJwt(user);
      }
    }
  }

  async appleMobile(body: any): Promise<AccessToken> {
    const appleData: any = this.jwtService.decode(body.idToken);

    if (!appleData) {
      throw new InternalServerErrorException('APPLE_TOKEN_NOT_VALID');
    }

    const { sub, email, email_verified } = appleData;

    if (!email_verified) {
      throw new InternalServerErrorException('APPLE_ID_EMAIL_NOT_CONFIRMED');
    }

    const existUser = await this.userRepository.findOne({ email: email });

    if (existUser) {
      if (!existUser.appleId) {
        existUser.appleId = sub;
        await existUser.save();
      }
      return await this.createJwt(existUser);
    } else {
      const user = await this.userRepository.saveAppleUser({
        email: email,
        login: email.split('@')[0],
        appleId: sub,
      });
      return await this.createJwt(user);
    }
  }
}
