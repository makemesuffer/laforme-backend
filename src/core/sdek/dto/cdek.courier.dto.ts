import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CdekCourierDto {
  @IsNotEmpty()
  @IsString()
  cdek_number: string;

  @IsNotEmpty()
  @IsString()
  intake_date: string; // date (yyyy-MM-dd)

  @IsNotEmpty()
  @IsString()
  intake_time_from: string;

  @IsNotEmpty()
  @IsString()
  intake_time_to: string;

  @IsOptional()
  @IsString()
  comment: string;

  @IsOptional()
  @IsBoolean()
  need_call: boolean;
}
