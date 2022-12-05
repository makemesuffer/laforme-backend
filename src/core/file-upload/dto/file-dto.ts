import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class FileDto {
  @IsNotEmpty()
  @IsUUID('all')
  id: string;

  @IsNotEmpty()
  @IsString()
  fileUrl: string;
}
