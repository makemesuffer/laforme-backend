import { BadRequestException } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';

import { UserEntity } from '../user/user.entity';
import { AUTH_ERROR } from './enum/auth-error.enum';
import { UserLoginDto } from './dto/user-login.dto';

@EntityRepository(UserEntity)
export class AuthRepository extends Repository<UserEntity> {
  async login(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const { login, password } = userLoginDto;

    const user = await this.findOne({
      where: [{ login }, { email: login }],
    });

    if (user === undefined) {
      throw new BadRequestException(AUTH_ERROR.USER_NOT_FOUND);
    } else {
      const passwordCorrect = await user.validatePassword(password);

      if (passwordCorrect === false) {
        throw new BadRequestException(AUTH_ERROR.WRONG_PASSWORD_OR_LOGIN);
      } else {
        return user;
      }
    }
  }
}
