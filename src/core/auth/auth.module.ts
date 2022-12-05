import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { JwtConfig } from '../../config/jwt.config';
import { UserEntity } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy';
import { FacebookStrategy } from './facebook.strategy';

import { AppleStrategy } from './apple.strategy';
import { CacheModuleConfig } from 'src/config/cache.config';

@Module({
  imports: [
    CacheModule.register(CacheModuleConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(JwtConfig),
    TypeOrmModule.forFeature([UserEntity, UserRepository, AuthRepository]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
    AppleStrategy,
  ],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
