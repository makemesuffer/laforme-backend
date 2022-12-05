import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../user/user.entity';

import { UserInfoDto } from './dto/user-info.dto';
import { UserInfoUpdateDto } from './dto/user-info-update.dto';
import { UserInfoEntity } from './user-info.entity';

@Injectable()
export class UserInfoService {
  constructor(
    @InjectRepository(UserInfoEntity)
    private userInfoRepository: Repository<UserInfoEntity>,
  ) {}

  async create(user, fullName?: string): Promise<UserInfoDto> {
    return await this.userInfoRepository.save({
      userId: user.id,
      googleId: user?.googleId,
      appleId: user?.appleId,
      facebookId: user?.facebookId,
      fullName: fullName,
    });
  }

  async findOneByUserId(user: UserEntity): Promise<UserInfoEntity> {
    return await this.userInfoRepository.findOne({
      where: {
        userId: user.id,
      },
    });
  }

  async update(user, body: UserInfoUpdateDto) {
    const result = await this.userInfoRepository.findOne({
      where: {
        userId: user.id,
      },
    });

    if (!result) {
      throw new BadRequestException('Не удалось');
    }

    await this.userInfoRepository.update(result.id, body);
    return await this.findOneByUserId(user);
  }
}
