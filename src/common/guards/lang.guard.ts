import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { LangType } from '../enum/lang.enum';
import { LANG_ERROR } from '../enum/lang.enum';
@Injectable()
export class LangValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const langTypes: string[] = Object.values(LangType);
    const lang = String(value.lang);
    const index = langTypes.indexOf(lang);
    if (index === -1) {
      throw new BadRequestException(LANG_ERROR.UNCORRECTED_LANG_TYPE);
    }
    return lang;
  }
}
