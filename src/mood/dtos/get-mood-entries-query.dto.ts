import { IsDateString, IsOptional } from 'class-validator';

export class GetMoodEntriesQueryDto {
  @IsDateString({ strict: true })
  @IsOptional()
  from?: string;

  @IsDateString({ strict: true })
  @IsOptional()
  to?: string;
}
