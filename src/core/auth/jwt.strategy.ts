import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { JwtConfig } from '../../config/jwt.config';
import { UserEntity } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';

import { AUTH_ERROR } from './enum/auth-error.enum';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JwtConfig.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const { id } = payload;
    const user = await this.userRepository.findOne({ id });

    if (user === undefined) {
      throw new UnauthorizedException(AUTH_ERROR.UNAUTHORIZED);
    } else {
      return user;
    }
  }
}
