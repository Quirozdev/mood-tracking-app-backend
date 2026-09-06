import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigurationModule } from './config/configuration.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MoodModule } from './mood/mood.module';
import { LoggingInterceptor } from './core/interceptors/logging.interceptor';

@Module({
  imports: [
    ConfigurationModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    MoodModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
