import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../password/password.service';
import { TokensService } from './tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
    private readonly passwordService: PasswordService,
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const match = await this.passwordService.compare(password, user.password);

    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
    };

    const accessToken = await this.tokensService.generateAccessToken(payload);

    const refreshToken = await this.tokensService.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    const payload = await this.tokensService.verifyRefreshToken<{
      sub: string;
    }>(refreshToken);

    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }

    const existingUser = await this.usersService.findUserById(payload.sub);

    if (!existingUser) {
      throw new UnauthorizedException();
    }

    const newPayload = {
      sub: existingUser.id,
    };

    const accessToken =
      await this.tokensService.generateAccessToken(newPayload);

    const newRefreshToken =
      await this.tokensService.generateRefreshToken(newPayload);

    return { accessToken, refreshToken: newRefreshToken };
  }
}
