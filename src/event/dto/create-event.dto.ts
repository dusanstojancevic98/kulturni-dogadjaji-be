import { EventType } from '@prisma/client';
import {
  IsEnum,
  IsISO8601,
  IsInt,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsString()
  @MinLength(5)
  description: string;

  @IsISO8601()
  dateTime: string;

  @IsEnum(EventType)
  type: EventType;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsUrl()
  imageUrl: string;

  @IsString()
  institutionId: string;
}
