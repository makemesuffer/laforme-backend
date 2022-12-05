import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { FileDto } from 'src/core/file-upload/dto/file-dto';

export class SliderDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FileDto)
  imageUrl: FileDto;

  @IsNotEmpty()
  @IsString()
  headingTextRu: string;

  @IsNotEmpty()
  @IsString()
  headingTextEn: string;

  @IsOptional()
  @IsString()
  buttonTextRu: string;

  @IsOptional()
  @IsString()
  buttonTextEn: string;

  @IsOptional()
  @IsString()
  buttonUrl: string;

  @IsOptional()
  @IsString()
  titleTextColor: string;

  @IsOptional()
  @IsString()
  buttonColor: string;

  @IsOptional()
  @IsString()
  buttonTextColor: string;

  @IsOptional()
  @IsBoolean()
  isHaveButton: boolean;
}
