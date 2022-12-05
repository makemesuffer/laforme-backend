import { Module } from '@nestjs/common';
import { SdekService } from './sdek.service';
import { SdekController } from './sdek.controller';
import { DadataModule } from '../dadata/dadata.module';

@Module({
  providers: [SdekService],
  exports: [SdekService],
  controllers: [SdekController],
  imports: [DadataModule],
})
export class SdekModule {}
