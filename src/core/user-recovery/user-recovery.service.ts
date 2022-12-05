import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

import { randomUUID } from 'src/common/utils/hash';
import { UserRepository } from '../user/user.repository';
import { USER_ERROR } from '../user/enum/user-error.enum';

import { USER_RECOVERY_ERROR } from './enum/user-recovery-error.enum';
import { UserRecoveryDto } from './dto/user-recovery.dto';
import { UserRecoveryGetCodeDto } from './dto/user-recovery-get-code.dto';
import { UserRecoveryChangeCredentialsDto } from './dto/user-recovery-change-password.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserRecoveryService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private userRepository: UserRepository,
    private mailService: MailService,
  ) {}

  async sendRecoveryLinkToEmail({ email }: UserRecoveryDto): Promise<void> {
    const user = await this.userRepository.findOne({ email });
    if (!user) throw new BadRequestException(USER_ERROR.USER_NOT_FOUND);
    const payload: UserRecoveryGetCodeDto = {
      email: user.email,
      userId: user.id,
    };
    const code = randomUUID();
    await this.cacheManager.set(code, JSON.stringify(payload));
    console.log(`Generated recovery code: ${code}`);
    await this.mailService.sendRecoveryLinkToEmail(user.email, code);
  }

  async changePassword(
    code: string,
    data: UserRecoveryChangeCredentialsDto,
  ): Promise<void> {
    if (!code) {
      throw new BadRequestException(USER_RECOVERY_ERROR.TOKEN_DOESNT_EXISTS);
    }
    const rawPayload: string = await this.cacheManager.get(code);
    if (!rawPayload) {
      throw new BadRequestException(USER_RECOVERY_ERROR.TOKEN_DOESNT_EXISTS);
    }
    const { userId }: UserRecoveryGetCodeDto = JSON.parse(rawPayload);
    const user = await this.userRepository.findOne(userId);
    try {
      await this.userRepository.changePassword(user, data);
    } catch (err) {
      throw new InternalServerErrorException(
        USER_RECOVERY_ERROR.CHANGE_PASSWORD_ERROR,
      );
    }

    await this.cacheManager.del(code);
  }
}
