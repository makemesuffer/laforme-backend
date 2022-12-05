import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticType } from './enum/statistic.enum';
import { StatisticValidationPipe } from './pipe/statistic-type.pipe';
import { USER_ROLE } from '../user/enum/user-role.enum';
import { Roles } from '../user/decorator/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from '../user/guard/account.guard';

@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}

  @Roles(USER_ROLE.SUPER)
  @Get('price/get')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  price(
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Query(new StatisticValidationPipe()) type: StatisticType,
  ) {
    return this.statisticsService.priceStatistic(from, to, type);
  }

  @Roles(USER_ROLE.SUPER)
  @Get('count/get')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  count(
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Query(new StatisticValidationPipe()) type: StatisticType,
  ) {
    return this.statisticsService.countStatistic(from, to, type);
  }
  @Roles(USER_ROLE.SUPER)
  @Get('general/get')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  general(
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Query(new StatisticValidationPipe()) type: StatisticType,
  ) {
    return this.statisticsService.generalStatistic(from, to, type);
  }

  @Roles(USER_ROLE.SUPER)
  @Get('user/get')
  @UseGuards(AuthGuard('jwt'), AccountGuard)
  user(@Query('from') from: Date, @Query('to') to: Date) {
    return this.statisticsService.userStatistic(from, to);
  }

  @Get('pages/get')
  pages(
    @Query('from') from: Date,
    @Query('to') to: Date,
    @Query(new StatisticValidationPipe()) type: StatisticType,
  ) {
    return this.statisticsService.pageStatistic(from, to, type);
  }
}
