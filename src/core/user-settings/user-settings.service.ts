import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { UserSettingsUpdatePasswordDto } from './dto/user-settings-update-password.dto';
import { UserSettingsUpdateEmailDto } from './dto/user-settings-update-email.dto';
import { Cache } from 'cache-manager';
import { MailService } from '../mail/mail.service';
import { USER_ERROR } from '../user/enum/user-error.enum';
import { generateVendorCode } from 'src/common/utils/vendor-coder';
import { UserUpdateEmailRawDataDto } from '../auth/dto/user-update-email.dto';
import { UserVerificationEmailPayload } from './dto/user-verification-email-payload.type';

@Injectable()
export class UserSettingsService {
  constructor(
    private userRepository: UserRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private mailService: MailService,
  ) {}

  async updatePassword(
    user: UserEntity,
    data: UserSettingsUpdatePasswordDto,
  ): Promise<void> {
    const { newPassword } = data;
    const payload = { password: newPassword };

    this.userRepository.changePassword(user, payload);
  }

  async changeEmail(
    user: UserEntity,
    data: UserSettingsUpdateEmailDto,
  ): Promise<void> {
    const userIsExist = await this.userRepository.findOne({
      email: data.newEmail,
    });
    if (userIsExist) {
      throw new BadRequestException(USER_ERROR.EMAIL_ALREADY_IN_USE);
    }
    const passwordIsValid = user.validatePassword(data.password);
    if (!passwordIsValid) {
      throw new BadRequestException(USER_ERROR.ACCESS_DENIED);
    }
    if (user.email === data.newEmail) {
      throw new BadRequestException(
        USER_ERROR.MAIL_ALREADY_LINKED_TO_THIS_ACCOUNT,
      );
    }
    const newEmailData: UserUpdateEmailRawDataDto = {
      email: data.newEmail,
    };

    let codeOld = generateVendorCode().trim().toLocaleLowerCase();
    let codeNew = generateVendorCode().trim().toLocaleLowerCase();
    if (!user.emailConfirmed) codeOld = codeNew;
    console.log(codeOld, codeNew);

    await this.cacheManager.set(codeOld, JSON.stringify(newEmailData));
    await this.cacheManager.set(codeNew, JSON.stringify(newEmailData));

    await this.mailService.sendCodeForChangeMail({
      oldEmail: user.email,
      newEmail: data.newEmail,
      codeOld: codeOld.toUpperCase(),
      codeNew: codeNew.toUpperCase(),
      emailConfirmed: user.emailConfirmed,
    });
  }

  async sendVerifCodeToEmail(user: UserEntity): Promise<void> {
    console.log('user-change-email', user);

    if (user.emailConfirmed) {
      throw new BadRequestException(USER_ERROR.EMAIL_ALREADY_CONFIRMED);
    }
    const data: UserVerificationEmailPayload = {
      email: user.email,
      userId: user.id,
    };
    const code = generateVendorCode().toLowerCase();
    await this.cacheManager.set(user.email + code, JSON.stringify(data));
    console.log(`${user.email} verification code: ${code}`);
    await this.mailService.sendVerificationCodeToEmail(
      user.email,
      code.toUpperCase(),
    );
  }
}
