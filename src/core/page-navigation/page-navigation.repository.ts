import { EntityRepository, Repository } from 'typeorm';
import { PageNavigationEntity } from './page-navigation.entity';
import { StatisticType } from '../statistics/enum/statistic.enum';

@EntityRepository(PageNavigationEntity)
export class PageNavigationRepository extends Repository<PageNavigationEntity> {
  async statistics(from: Date, to: Date, type: StatisticType): Promise<any[]> {
    const query = await this.createQueryBuilder('page_navigation_statistic')
      .where('page_navigation_statistic.click_date >= :from', { from })
      .andWhere('page_navigation_statistic.click_date <= :to', { to });
    if (type === StatisticType.MasterClass) {
      query
        .leftJoinAndSelect(
          'page_navigation_statistic.masterClassId',
          'masterClassId',
        )
        .andWhere('page_navigation_statistic.masterClassId is not null')
        .andWhere('page_navigation_statistic.patternProductId is null')
        .andWhere('page_navigation_statistic.sewingProductId is null');
    }

    if (type === StatisticType.SewingProduct) {
      query
        .leftJoinAndSelect(
          'page_navigation_statistic.sewingProductId',
          'sewingProductId',
        )
        .andWhere('page_navigation_statistic.masterClassId is null')
        .andWhere('page_navigation_statistic.patternProductId is null')
        .andWhere('page_navigation_statistic.sewingProductId is not null');
    }
    if (type === StatisticType.PatternProduct) {
      query
        .leftJoinAndSelect(
          'page_navigation_statistic.patternProductId',
          'patternProductId',
        )
        .andWhere('page_navigation_statistic.masterClassId is null')
        .andWhere('page_navigation_statistic.patternProductId is not null')
        .andWhere('page_navigation_statistic.sewingProductId is null');
    }
    return await query.getMany();
  }
}
