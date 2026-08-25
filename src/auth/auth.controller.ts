import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from './auth.guard';
import type { Response } from 'express';
import { Cookies } from '../common/decorators/cookies.decorator';
import { UserResponseDto } from '../users/dto/user-reponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Sign In' })
  @ApiCreatedResponse({
    description: 'Logged in successfully',
    type: User,
  })
  @ApiUnauthorizedResponse({
    description: '',
  })
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return { accessToken, refreshToken };
  }

  @Post('/refresh-tokens')
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  refreshTokens(@Cookies('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('/me')
  @ApiOperation({ summary: 'Get own profile' })
  @ApiOkResponse({ type: UserResponseDto })
  @SerializeOptions({ type: UserResponseDto })
  profile(@Request() req) {
    return this.authService.getMe(req.user.sub);
  }
}
