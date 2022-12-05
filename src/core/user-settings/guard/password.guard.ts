import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { USER_SETTINGS_ERROR } from '../enum/user-settings-error.enum';
import { UserEntity } from '../../user/user.entity';

@Injectable()
export class PasswordGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { body, user }: { body: { password: string }; user: UserEntity } =
      request;

    if (!body || !user) {
      return false;
    }

    const { password } = body;

    if (!password) {
      return false;
    }

    const passwordCorrect = await user.validatePassword(password);

    if (!passwordCorrect) {
      throw new BadRequestException(
        USER_SETTINGS_ERROR.UNCORRECT_CURRENT_PASSWORD,
      );
    } else {
      return true;
    }
  }
}
