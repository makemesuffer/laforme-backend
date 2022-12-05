import { MailerModule } from '@nestjs-modules/mailer';

import { CacheModule, Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailConfig } from '../../config/mail.config';

import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import * as path from 'path';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModuleConfig } from 'src/config/cache.config';
import { UserRepository } from '../user/user.repository';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule,
    CacheModule.register(CacheModuleConfig),
    MailerModule.forRoot({
      transport: {
        host: MailConfig.host,
        secure: false,
        auth: {
          user: MailConfig.email,
          pass: MailConfig.password,
        },
      },
      defaults: {
        from: `La\`forme Patterns <${MailConfig.email}>`,
      },
      template: {
        dir: path.join(path.resolve(), 'src/templates/'),
        adapter: new PugAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
