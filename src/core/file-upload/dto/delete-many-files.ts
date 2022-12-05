import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

export class DeleteManyFilesDto {
  @IsNotEmpty()
  @IsArray()
  files: [];
}
