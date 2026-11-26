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
    await this.moodEntryRepository.upsert(
      {
        ...logMoodDto,
        day,
        user: { id: userId },
      },
      {
        conflictPaths: ['day', 'user'],
      },
    );
    return this.findMoodEntryByDayAndUser(userId, day);
  }

  async getAveragesFromPreviousCheckins(userId: string, lastCheckIns: number) {
    const moodData = await this.getMoodAverageDataForUser(userId, lastCheckIns);
    const sleepHoursData = await this.getSleepHoursAverageDataForUser(
      userId,
      lastCheckIns,
    );
    return { mood: moodData, sleepHours: sleepHoursData };
  }

  // compare last 5 days with their previous 5 days
  private async getMoodAverageDataForUser(
    userId: string,
    lastCheckIns: number,
  ) {
    const queryBuilder = this.moodEntryRepository.createQueryBuilder('moods');

    queryBuilder.select('moods.mood', 'mood');
    queryBuilder.addSelect('COUNT(moods.mood)', 'count');
    queryBuilder.groupBy('moods.mood');
    queryBuilder.addGroupBy('moods.day');
    queryBuilder.orderBy('moods.day', 'DESC');

    queryBuilder.andWhere('moods.userId = :id', { id: userId });

    queryBuilder.limit(lastCheckIns * 2);

    const data = await queryBuilder.getRawMany<{
      mood: Mood;
      count: number;
    }>();

    const lastCheckInsSlice = data.slice(0, lastCheckIns);

    const previousCheckInsSlice = data.slice(lastCheckIns, data.length);

    const lastCheckInsResult =
      this.calculateMoodAverageResult(lastCheckInsSlice);

    const previousCheckInsResult = this.calculateMoodAverageResult(
      previousCheckInsSlice,
    );

    return {
      last: lastCheckInsResult,
      previous: previousCheckInsResult,
    };
  }

  private async getSleepHoursAverageDataForUser(
    userId: string,
    lastCheckIns: number,
  ) {
    const queryBuilder = this.moodEntryRepository.createQueryBuilder('moods');

    queryBuilder.select('moods.sleepHours', 'sleepHours');
    queryBuilder.addSelect('COUNT(moods.sleepHours)', 'count');
    queryBuilder.groupBy('moods.sleepHours');
    queryBuilder.addGroupBy('moods.day');
    queryBuilder.orderBy('moods.day', 'DESC');

    queryBuilder.andWhere('moods.userId = :id', { id: userId });

    queryBuilder.limit(lastCheckIns * 2);

    const data = await queryBuilder.getRawMany<{
      sleepHours: SleepHours;
      count: number;
    }>();

    const lastCheckInsSlice = data.slice(0, lastCheckIns);

    const previousCheckInsSlice = data.slice(lastCheckIns, data.length);

    const lastCheckInsResult =
      this.calculateSleepHoursAverageResult(lastCheckInsSlice);

    const previousCheckInsResult = this.calculateSleepHoursAverageResult(
      previousCheckInsSlice,
    );

    return { last: lastCheckInsResult, previous: previousCheckInsResult };
  }

  private calculateMoodAverageResult(data: { mood: Mood; count: number }[]) {
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

    return {
      value: valueToMood[average],
      average,
      days: totalCount,
    };
  }

  private calculateSleepHoursAverageResult(
    data: { sleepHours: SleepHours; count: number }[],
  ) {
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

    return {
      value: valueToSleepHours[average],
      average,
      days: totalCount,
    };
  }
}
