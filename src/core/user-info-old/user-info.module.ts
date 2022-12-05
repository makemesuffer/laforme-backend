import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserInfoEntity } from './user-info.entity';
import { UserInfoController } from './user-info.controller';
import { UserInfoService } from './user-info.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserInfoEntity])],
  controllers: [UserInfoController],
  providers: [UserInfoService],
  exports: [UserInfoService],
})
export class UserInfoModule {}
