import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodEntry } from './entities/mood-entry.entity';
import { MoodController } from './mood.controller';
import { MoodService } from './mood.service';

@Module({
  imports: [TypeOrmModule.forFeature([MoodEntry])],
  controllers: [MoodController],
  providers: [MoodService],
})
export class MoodModule {}
