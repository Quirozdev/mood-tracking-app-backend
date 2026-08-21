import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '../config/jwt.config';
import { PasswordService } from '../password/password.service';
import { TokensService } from './tokens.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [jwtConfig.KEY],
      global: true,
      useFactory: (config: ConfigType<typeof jwtConfig>) => ({
        secret: config.accessTokenSecret as string,
        signOptions: {
          expiresIn: config.accessTokenExpiresIn as JwtSignOptions['expiresIn'],
        },
      }),
    }),
  ],
  providers: [AuthService, PasswordService, TokensService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
