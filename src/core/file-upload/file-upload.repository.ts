import { FileUploadEntity } from './file-upload.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(FileUploadEntity)
export class FileUploadRepository extends Repository<FileUploadEntity> {
  async getOne(id: string): Promise<FileUploadEntity> {
    return await this.createQueryBuilder('files')
      .leftJoinAndSelect('files.optionFilePdf', 'optionFilePdf')
      .where('files.id = :id', { id })
      .getOne();
  }
}
