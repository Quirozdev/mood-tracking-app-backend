import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { Mood } from '../enums/mood.enum';
import { Feeling } from '../enums/feeling.enum';
import { SleepHours } from '../enums/sleep-hours.enum';
import { ApiProperty } from '@nestjs/swagger';

export class LogMoodDto {
  @IsEnum(Mood)
  @ApiProperty({
    enum: Mood,
    description: 'Mood',
    example: Mood.VERY_HAPPY,
  })
  mood!: Mood;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @ArrayUnique()
  @IsEnum(Feeling, { each: true })
  @ApiProperty({
    enum: Feeling,
    type: [String],
    description: 'Feelings array',
    example: [Feeling.CALM, Feeling.CONFIDENT],
  })
  feelings!: Feeling[];

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @ApiProperty({
    type: String,
    description: 'Journal entry',
    example: 'Today i...',
  })
  journalEntry!: string;

  @IsEnum(SleepHours)
  @ApiProperty({
    enum: SleepHours,
    description: 'Sleep hours',
    example: SleepHours.SEVEN_TO_EIGHT_HOURS,
  })
  sleepHours!: SleepHours;
}
