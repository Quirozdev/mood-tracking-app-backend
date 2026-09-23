import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoodEntry } from './entities/mood-entry.entity';
import { Repository } from 'typeorm';
import { LogMoodDto } from './dtos/log-mood.dto';
import { Mood } from './enums/mood.enum';
import { SleepHours } from './enums/sleep-hours.enum';
import {
  moodToValue,
  sleepHoursToValue,
  valueToMood,
  valueToSleepHours,
} from './consts/mood.const';

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

  async getMoodEntries(userId: string) {
    return await this.moodEntryRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      select: {
        id: true,
        day: true,
        mood: true,
        sleepHours: true,
        journalEntry: true,
        feelings: true,
      },
      order: {
        day: {
          direction: 'ASC',
        },
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

  async getAveragesInDateRange(userId: string, from: string, to: string) {
    const moodData = await this.getMoodAverageDataForUser(userId, from, to);
    const sleepHoursData = await this.getSleepHoursAverageDataForUser(
      userId,
      from,
      to,
    );
    return { mood: moodData, sleepHours: sleepHoursData };
  }

  private async getMoodAverageDataForUser(
    userId: string,
    from: string,
    to: string,
  ) {
    const queryBuilder = this.moodEntryRepository.createQueryBuilder('moods');

    queryBuilder.select('moods.mood', 'mood');
    queryBuilder.addSelect('COUNT(moods.mood)', 'count');
    queryBuilder.groupBy('moods.mood');

    queryBuilder.andWhere('moods.userId = :id', { id: userId });
    queryBuilder.andWhere('moods.day >= :from', { from });
    queryBuilder.andWhere('moods.day <= :to', { to });

    const data = await queryBuilder.getRawMany<{
      mood: Mood;
      count: number;
    }>();

    const { total, totalCount } = data.reduce(
      (prev, current) => {
        return {
          totalCount: prev.totalCount + Number(current.count),
          total: prev.total + moodToValue[current.mood] * Number(current.count),
        };
      },
      {
        totalCount: 0,
        total: 0,
      },
    );

    const average = Math.round(total / totalCount);

    return { value: valueToMood[average], average, days: totalCount };
  }

  private async getSleepHoursAverageDataForUser(
    userId: string,
    from: string,
    to: string,
  ) {
    const queryBuilder = this.moodEntryRepository.createQueryBuilder('moods');

    queryBuilder.select('moods.sleepHours', 'sleepHours');
    queryBuilder.addSelect('COUNT(moods.sleepHours)', 'count');
    queryBuilder.groupBy('moods.sleepHours');

    queryBuilder.andWhere('moods.userId = :id', { id: userId });
    queryBuilder.andWhere('moods.day >= :from', { from });
    queryBuilder.andWhere('moods.day <= :to', { to });

    const data = await queryBuilder.getRawMany<{
      sleepHours: SleepHours;
      count: number;
    }>();

    const { total, totalCount } = data.reduce(
      (prev, current) => {
        return {
          totalCount: prev.totalCount + Number(current.count),
          total:
            prev.total +
            sleepHoursToValue[current.sleepHours] * Number(current.count),
        };
      },
      {
        totalCount: 0,
        total: 0,
      },
    );

    const average = Math.round(total / totalCount);

    return { value: valueToSleepHours[average], average, days: totalCount };
  }
}
