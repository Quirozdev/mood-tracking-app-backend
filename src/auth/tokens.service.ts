import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class TokensService {
  private readonly accessTokenSecret: string;
  private readonly accessTokenExpiresIn: JwtSignOptions['expiresIn'];
  private readonly refreshTokenSecret: string;
  private readonly refreshTokenExpiresIn: JwtSignOptions['expiresIn'];

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenSecret = this.configService.getOrThrow<string>(
      'jwt.accessTokenSecret',
    );
    this.accessTokenExpiresIn = this.configService.getOrThrow<
      JwtSignOptions['expiresIn']
    >('jwt.accessTokenExpiresIn');
    this.refreshTokenSecret = this.configService.getOrThrow<string>(
      'jwt.refreshTokenSecret',
    );
    this.refreshTokenExpiresIn = this.configService.getOrThrow<
      JwtSignOptions['expiresIn']
    >('jwt.refreshTokenExpiresIn');
  }

  async generateAccessToken(payload: object) {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.accessTokenExpiresIn,
      secret: this.accessTokenSecret,
    });
    return token;
  }

  async generateRefreshToken(payload: object) {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.refreshTokenExpiresIn,
      secret: this.refreshTokenSecret,
    });
    return token;
  }

  async verifyRefreshToken<T extends object>(
    token: string,
  ): Promise<T | undefined> {
    try {
      return await this.jwtService.verifyAsync<T>(token, {
        secret: this.refreshTokenSecret,
      });
    } catch {
      return undefined;
    }
  }
}
