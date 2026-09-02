import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Mood } from '../enums/mood.enum';
import { Feeling } from '../enums/feeling.enum';
import { SleepHours } from '../enums/sleep-hours.enum';

@Entity({ name: 'mood_entries' })
@Index(['day', 'user'], { unique: true })
export class MoodEntry {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'date' })
  day!: string;

  @Column({ type: 'varchar', length: 55 })
  mood!: Mood;

  @Column({ type: 'simple-array' })
  feelings!: Feeling[];

  @Column({ type: 'varchar', length: 150 })
  journalEntry!: string;

  @Column({ type: 'varchar', length: 55 })
  sleepHours!: SleepHours;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date | null;
}
