import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LogMoodDto } from './dtos/log-mood.dto';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { MoodService } from './mood.service';
import { MoodEntryParamsDto } from './dtos/mood-entry-params.dto';

@Controller('moods')
@ApiTags('Moods')
export class MoodController {
  constructor(private readonly moodService: MoodService) {}

  @UseGuards(AuthGuard)
  @Get(':day')
  @ApiParam({
    name: 'day',
    type: String,
    description: 'Day for the mood entry',
    example: '2026-09-01',
  })
  @ApiOperation({
    summary: 'Get mood entry from a given day',
  })
  @ApiOkResponse({ summary: 'Mood entry retrieved successfully' })
  @ApiNotFoundResponse()
  async getMoodEntryByDay(@Request() req, @Param() params: MoodEntryParamsDto) {
    const moodEntry = await this.moodService.findMoodEntryByDayAndUser(
      req.user.sub,
      params.day,
    );
    if (!moodEntry) {
      throw new NotFoundException('Mood entry not found');
    }
    return moodEntry;
  }

  @UseGuards(AuthGuard)
  @Put(':day')
  @ApiParam({
    name: 'day',
    type: String,
    description: 'Day for the mood entry',
    example: '2026-09-01',
  })
  @ApiOperation({
    summary:
      'Log mood for given day, if there is already a entry that day, it updates it',
  })
  @ApiOkResponse({
    description: 'Mood entry created/updated successfully',
    type: LogMoodDto,
  })
  @ApiBadRequestResponse()
  logMoodEntry(
    @Request() req,
    @Body() logMoodDto: LogMoodDto,
    @Param() params: MoodEntryParamsDto,
  ) {
    return this.moodService.logMoodEntry(req.user.sub, params.day, logMoodDto);
  }
}
