import { registerAs } from '@nestjs/config';
import { databaseOptions } from './database.options.js';

export default registerAs('database', () => databaseOptions);
