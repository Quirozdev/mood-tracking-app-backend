import { OmitType } from '@nestjs/swagger';
import { MoodEntryResponseDto } from './mood-entry-response.dto';

export class GetMoodEntriesResponseDto extends OmitType(MoodEntryResponseDto, [
  'createdAt',
  'updatedAt',
]) {}
