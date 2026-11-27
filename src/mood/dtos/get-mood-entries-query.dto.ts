import { IsDateString, IsOptional } from 'class-validator';
import { IsAfterOrEqualDate } from '../../common/validators/is-after-or-equal-date.validator';

export class GetMoodEntriesQueryDto {
  @IsDateString({ strict: true })
  @IsOptional()
  from?: string;

  @IsDateString({ strict: true })
  @IsAfterOrEqualDate('from', {
    message: "'To' date must be after or equal to 'from' date",
  })
  @IsOptional()
  to?: string;
}
