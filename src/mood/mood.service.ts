import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoodEntry } from './entities/mood-entry.entity';
import { Repository } from 'typeorm';
import { LogMoodDto } from './dtos/log-mood.dto';

@Injectable()
export class MoodService {
  constructor(
    @InjectRepository(MoodEntry)
    private readonly moodEntryRepository: Repository<MoodEntry>,
  ) {}

  async findMoodEntryByDayAndUser(userId: string, day: string) {
    return await this.moodEntryRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        day: day,
      },
    });
  }

  async logMoodEntry(userId: string, day: string, logMoodDto: LogMoodDto) {
    const alreadyLoggedMoodEntry = await this.findMoodEntryByDayAndUser(
      userId,
      day,
    );

    if (!alreadyLoggedMoodEntry) {
      const newMoodEntry = this.moodEntryRepository.create({
        day: day,
        mood: logMoodDto.mood,
        feelings: logMoodDto.feelings,
        journalEntry: logMoodDto.journalEntry,
        sleepHours: logMoodDto.sleepHours,
        user: {
          id: userId,
        },
      });
      return await this.moodEntryRepository.save(newMoodEntry);
    }

    const mergedMoodEntry = this.moodEntryRepository.merge(
      alreadyLoggedMoodEntry,
      logMoodDto,
    );
    return await this.moodEntryRepository.save(mergedMoodEntry);
  }
}
