import { InstitutionType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class QueryInstitutionsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => parseInt(value, 10))
  pageSize?: number = 20;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsEnum(InstitutionType)
  type?: InstitutionType;
}
