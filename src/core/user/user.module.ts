import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { CacheModuleConfig } from 'src/config/cache.config';

@Module({
  imports: [
    CacheModule.register(CacheModuleConfig),
    TypeOrmModule.forFeature([UserRepository, UserEntity]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
