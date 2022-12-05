import { IsString, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

export class DadataDto {
  @IsString()
  @IsNotEmpty()
  value: string;

  @ArrayNotEmpty()
  @IsArray()
  locations: any;
}
