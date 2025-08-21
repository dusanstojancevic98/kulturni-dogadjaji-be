import { InstitutionType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateInstitutionDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(5)
  description: string;

  @IsEnum(InstitutionType)
  type: InstitutionType;

  @IsString()
  @MinLength(3)
  address: string;

  @IsEmail()
  contactEmail: string;

  @IsUrl()
  imageUrl: string;

  @IsOptional() @IsNumber() latitude?: number;
  @IsOptional() @IsNumber() longitude?: number;
}
