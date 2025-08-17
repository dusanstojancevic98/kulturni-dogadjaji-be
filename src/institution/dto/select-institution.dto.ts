import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class SelectInstitutionsDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  @Transform(({ value }) => parseInt(value, 10))
  take?: number = 200;
}
