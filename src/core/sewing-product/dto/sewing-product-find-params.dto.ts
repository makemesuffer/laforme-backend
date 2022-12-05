import { LangType } from 'src/common/enum/lang.enum';
import { PaginationType } from 'src/common/pipe/page-validation.pipe';

export class findAllSewingProductParamsDto extends PaginationType {
  sort: string;
  by: 'DESC' | 'ASC';
  where: string;
  category: string;
  lang: LangType;
  userId?: number;
  getAll?: boolean;
}

export type findOneSewingProductParamsDto = {
  id: string;
  userId?: number;
};
