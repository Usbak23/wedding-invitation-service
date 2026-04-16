import { NestFactory, NestApplication } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from '../src/app.module';
import { setupSwagger } from '../src/routes/swagger.route';
import { GlobalExceptionFilter } from '../src/middlewares/exception.filter';
import { AppLogger } from '../src/middlewares/app-logger';
import { Express } from 'express';

let app: NestApplication;

async function createApp() {
    if (app) return app;

    app = await NestFactory.create<NestApplication>(AppModule, {
        logger: new AppLogger()
    });

    app.use(helmet());
    app.use(cookieParser());
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    app.enableCors({
        origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3001',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    });

    setupSwagger(app);
    await app.init();

    return app;
}

export default async function handler(req: any, res: any) {
    const nestApp = await createApp();
    const expressApp = nestApp.getHttpAdapter().getInstance() as Express;
    expressApp(req, res);
}
