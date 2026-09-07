import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  SerializeOptions,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { Cookies } from '../common/decorators/cookies.decorator';
import { UserResponseDto } from '../users/dto/user-reponse.dto';
import { Auth } from './decorators/auth.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthenticatedUser } from './types/authenticated-user.type';
import { TokensResponseDto } from './dto/tokens-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Sign In' })
  @ApiCreatedResponse({
    description: 'Logged in successfully',
    type: TokensResponseDto,
  })
  @ApiUnauthorizedResponse()
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
  @ApiOkResponse({ type: TokensResponseDto })
  @ApiUnauthorizedResponse()
  refreshTokens(@Cookies('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }

  @Auth()
  @Post('logout')
  @ApiOperation({ summary: 'Log out' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  logOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
  }

  @Auth()
  @Get('/me')
  @ApiOperation({ summary: 'Get own profile' })
  @ApiOkResponse({ type: UserResponseDto })
  @SerializeOptions({ type: UserResponseDto })
  profile(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getMe(user.sub);
  }
}
