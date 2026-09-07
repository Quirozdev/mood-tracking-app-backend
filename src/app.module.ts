import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigurationModule } from './config/configuration.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MoodModule } from './mood/mood.module';
import { LoggerMiddleware } from './core/middlewares/logger.middleware';

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
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
