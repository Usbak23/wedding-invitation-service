import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    port: parseInt(process.env.APP_PORT ?? process.env.PORT ?? '3010', 10) || 3010,
    env: process.env.APP_ENV ?? process.env.NODE_ENV ?? 'development'
}));
