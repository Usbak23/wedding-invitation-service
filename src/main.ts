import { NestFactory, NestApplication } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import pg from 'pg';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { setupSwagger } from './routes/swagger.route';
import { GlobalExceptionFilter } from './middlewares/exception.filter';
import { AppLogger } from './middlewares/app-logger';

dotenv.config();

const logger = new Logger('Bootstrap');

async function ensureDatabase(): Promise<void> {
  const dbName = process.env.DB_NAME;
  const client = new pg.Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD || undefined,
    database: 'postgres',
  });

  await client.connect();

  const res = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [dbName],
  );

  if (res.rowCount === 0) {
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`[Database] "${dbName}" created successfully`);
  } else {
    console.log(`[Database] "${dbName}" already exists`);
  }

  await client.end();
}

async function bootstrap() {
  try {
    await ensureDatabase();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Database] Failed to ensure database:', message);
  }

  const app = await NestFactory.create<NestApplication>(AppModule, {
    logger: new AppLogger(),
  });

  app.use(helmet());
  app.use(cookieParser());

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  setupSwagger(app);

  const port = process.env.APP_PORT || 3000;
  await app.listen(port);
  logger.log(`Application running on port ${port}`);
}
bootstrap();
