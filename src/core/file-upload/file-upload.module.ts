import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { FileUploadRepository } from './file-upload.repository';
import { FileUploadEntity } from './file-upload.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileUploadRepository, FileUploadEntity])],
  providers: [FileUploadService],
  exports: [FileUploadService],
  controllers: [FileUploadController],
})
export class FileUploadModule {}
