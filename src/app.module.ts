import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigurationModule } from './config/configuration.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [ConfigurationModule, DatabaseModule, UsersModule, AuthModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
