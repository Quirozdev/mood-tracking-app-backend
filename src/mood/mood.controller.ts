import { Body, Controller, Put, Request, UseGuards } from '@nestjs/common';
import { LogMoodDto } from './dtos/log-mood.dto';
import { AuthGuard } from '../auth/auth.guard';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { MoodService } from './mood.service';

@Controller('moods')
@ApiTags('Moods')
export class MoodController {
  constructor(private readonly moodService: MoodService) {}

  @UseGuards(AuthGuard)
  @Put('/log-mood')
  @ApiOperation({
    summary:
      'Log mood for given day, if there is already a entry that day, it updates it',
  })
  @ApiOkResponse({
    description: 'Mood entry created/updated successfully',
    type: LogMoodDto,
  })
  @ApiBadRequestResponse()
  logMoodEntry(@Request() req, @Body() logMoodDto: LogMoodDto) {
    return this.moodService.logMoodEntry(req.user.sub, logMoodDto);
  }
}
