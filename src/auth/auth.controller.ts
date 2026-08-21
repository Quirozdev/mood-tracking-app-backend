import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
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
import { RefreshTokensDto } from './dto/refresh-tokens.dto';

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
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Post('/refresh-tokens')
  @ApiOperation({ summary: 'Refresh access and refresh tokens' })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  refreshTokens(@Body() refreshTokensDto: RefreshTokensDto) {
    return this.authService.refreshTokens(refreshTokensDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('/profile')
  @ApiOperation({ summary: 'Get own profile' })
  @ApiOkResponse({})
  @ApiUnauthorizedResponse({})
  profile(@Request() req) {
    return req.user;
  }
}
