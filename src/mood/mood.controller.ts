import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Put,
  Query,
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
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MoodService } from './mood.service';
import { MoodEntryParamsDto } from './dtos/mood-entry-params.dto';
import { GetAveragesQueryDto } from './dtos/get-averages-query.dto';
import { MoodEntryResponseDto } from './dtos/mood-entry-response.dto';
import { GetMoodEntriesResponseDto } from './dtos/get-mood-entries-response.dto';

@Controller('moods')
@ApiTags('Moods')
export class MoodController {
  constructor(private readonly moodService: MoodService) {}

  @UseGuards(AuthGuard)
  @Get('/entries')
  @ApiOperation({
    summary: 'Get mood entries',
  })
  @ApiOkResponse({
    summary: 'Mood entry retrieved successfully',
    type: [GetMoodEntriesResponseDto],
  })
  async getEntries(@Request() req): Promise<GetMoodEntriesResponseDto[]> {
    return await this.moodService.getMoodEntries(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('/averages')
  @ApiOperation({
    summary: 'Get averages for mood and sleep hours in a given range of days',
  })
  @ApiQuery({
    name: 'from',
    type: String,
    description: 'Day from where the averages will start to be calculated',
    example: '2026-09-01',
  })
  @ApiQuery({
    name: 'to',
    type: String,
    description: 'Day from where the averages will end to be calculated',
    example: '2026-09-05',
  })
  async getAverages(@Request() req, @Query() query: GetAveragesQueryDto) {
    return await this.moodService.getAveragesInDateRange(
      req.user.sub,
      query.from,
      query.to,
    );
  }

  @UseGuards(AuthGuard)
  @Get(':day')
  @ApiOperation({
    summary: 'Get mood entry from a given day',
  })
  @ApiParam({
    name: 'day',
    type: String,
    description: 'Day for the mood entry',
    example: '2026-09-01',
  })
  @ApiOkResponse({
    summary: 'Mood entry retrieved successfully',
    type: MoodEntryResponseDto,
  })
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
  @ApiOperation({
    summary:
      'Log mood for given day, if there is already a entry that day, it updates it',
  })
  @ApiParam({
    name: 'day',
    type: String,
    description: 'Day for the mood entry',
    example: '2026-09-01',
  })
  @ApiOkResponse({
    description: 'Mood entry created/updated successfully',
    type: LogMoodDto,
  })
  @ApiBadRequestResponse()
  async logMoodEntry(
    @Request() req,
    @Body() logMoodDto: LogMoodDto,
    @Param() params: MoodEntryParamsDto,
  ) {
    return await this.moodService.logMoodEntry(
      req.user.sub,
      params.day,
      logMoodDto,
    );
  }
}
