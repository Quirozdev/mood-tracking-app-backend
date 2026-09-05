import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Mood } from '../enums/mood.enum';
import { Feeling } from '../enums/feeling.enum';
import { SleepHours } from '../enums/sleep-hours.enum';

@Exclude()
export class MoodEntryResponseDto {
  @Expose()
  @ApiProperty({
    type: String,
    description: 'ID',
    example: 'b21fb708-3d01-4875-957a-3872f0dd4f85',
  })
  id!: string;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Day of this mood entry',
    example: '2026-09-01',
  })
  day!: string;

  @Expose()
  @ApiProperty({
    enum: Mood,
    description: 'Mood',
    example: Mood.VERY_HAPPY,
  })
  mood!: Mood;

  @Expose()
  @ApiProperty({
    enum: Feeling,
    type: [String],
    description: 'Feelings array',
    example: [Feeling.CALM, Feeling.CONFIDENT],
  })
  feelings!: Feeling[];

  @Expose()
  @ApiProperty({
    type: String,
    description: 'Journal entry',
    example: 'Today i...',
  })
  journalEntry!: string;

  @Expose()
  @ApiProperty({
    enum: SleepHours,
    description: 'Sleep hours',
    example: SleepHours.SEVEN_TO_EIGHT_HOURS,
  })
  sleepHours!: SleepHours;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'createdAt',
    example: '2026-08-19T22:55:25.702Z',
  })
  createdAt!: Date;

  @Expose()
  @ApiProperty({
    type: String,
    description: 'updatedAt',
    example: '2026-08-19T22:55:25.702Z',
    nullable: true,
  })
  updatedAt!: Date | null;
}
