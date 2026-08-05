import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  node_env: process.env.NODE_ENV,
  port: Number(process.env.PORT) || 3000,
}));
