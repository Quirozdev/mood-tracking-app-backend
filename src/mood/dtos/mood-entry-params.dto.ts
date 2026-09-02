import { IsDateString } from 'class-validator';

export class MoodEntryParamsDto {
  @IsDateString({ strict: true })
  day!: string;
}
