import { Module, forwardRef, CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserRepository } from '../user/user.repository';
import { UserSettingsService } from './user-settings.service';
import { UserSettingsController } from './user-settings.controller';
import { CacheModuleConfig } from 'src/config/cache.config';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    CacheModule.register(CacheModuleConfig),
    MailModule,
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [UserSettingsController],
  providers: [UserSettingsService],
})
export class UserSettingsModule {}
