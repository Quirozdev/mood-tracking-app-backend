import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigurationModule } from './config/configuration.module.js';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   validationSchema: Joi.object({
    //     NODE_ENV: Joi.string()
    //       .valid('development', 'production', 'test', 'provision')
    //       .default('development'),
    //     PORT: Joi.number().port().default(3000),
    //   }),
    //   validationOptions: {
    //     allowUnknown: true,
    //     abortEarly: true,
    //   },
    //   load: [appConfig, databaseConfig, jwtConfig],
    // }),
    ConfigurationModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
