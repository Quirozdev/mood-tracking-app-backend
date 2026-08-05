import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config.js';
import databaseConfig from './database.config.js';
import jwtConfig from './jwt.config.js';
import { envValidationSchema } from './env.validation.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
      load: [appConfig, databaseConfig, jwtConfig],
    }),
  ],
})
export class ConfigurationModule {}
