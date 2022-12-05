import { Module } from '@nestjs/common';
import { DadataService } from './dadata.service';
import { DadataController } from './dadata.controller';

@Module({
  providers: [DadataService],
  exports: [DadataService],
  controllers: [DadataController],
})
export class DadataModule {}
