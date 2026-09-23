import { Mood } from '../enums/mood.enum';
import { SleepHours } from '../enums/sleep-hours.enum';

export const moodToValue: Record<Mood, number> = {
  [Mood.VERY_SAD]: -2,
  [Mood.SAD]: -1,
  [Mood.NEUTRAL]: -0,
  [Mood.HAPPY]: 1,
  [Mood.VERY_HAPPY]: 2,
};

export const valueToMood: Record<number, Mood> = {
  [-2]: Mood.VERY_SAD,
  [-1]: Mood.SAD,
  0: Mood.NEUTRAL,
  1: Mood.HAPPY,
  2: Mood.VERY_HAPPY,
};

export const sleepHoursToValue: Record<SleepHours, number> = {
  [SleepHours.ZERO_TO_TWO_HOURS]: 0,
  [SleepHours.THREE_TO_FOUR_HOURS]: 1,
  [SleepHours.FIVE_TO_SIX_HOURS]: 2,
  [SleepHours.SEVEN_TO_EIGHT_HOURS]: 3,
  [SleepHours.NINE_HOURS_OR_MORE]: 4,
};

export const valueToSleepHours: Record<number, SleepHours> = {
  0: SleepHours.ZERO_TO_TWO_HOURS,
  1: SleepHours.THREE_TO_FOUR_HOURS,
  2: SleepHours.FIVE_TO_SIX_HOURS,
  3: SleepHours.SEVEN_TO_EIGHT_HOURS,
  4: SleepHours.NINE_HOURS_OR_MORE,
};
