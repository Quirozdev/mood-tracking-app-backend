import 'dotenv/config';
import { DataSource } from 'typeorm';
import { databaseOptions } from '../../config/database.options.js';

export default new DataSource(databaseOptions);
