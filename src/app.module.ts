import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigurationModule } from './config/configuration.module';

@Module({
  imports: [ConfigurationModule, DatabaseModule, UsersModule, AuthModule],
})
export class AppModule {}
