import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PageNavigationRepository } from './page-navigation.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PageNavigationRepository])],
})
export class PageNavigationModule {}
