import { INestApplication } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import * as path from 'path';
import { SwaggerModel } from '../interfaces/swagger.interface';

const swaggerDev: SwaggerModel = require(path.resolve('./documentation/swagger.json'));
const swaggerStaging: SwaggerModel = require(path.resolve('./documentation/swaggerStaging.json'));
const swaggerProduction: SwaggerModel = require(path.resolve('./documentation/swaggerProduction.json'));

const authPath = require(path.resolve('./documentation/path/auth.json'));
const invitationPath = require(path.resolve('./documentation/path/invitation.json'));
const guestPath = require(path.resolve('./documentation/path/guest.json'));
const rsvpPath = require(path.resolve('./documentation/path/rsvp.json'));
const galleryPath = require(path.resolve('./documentation/path/gallery.json'));
const analyticsPath = require(path.resolve('./documentation/path/analytics.json'));
const publicPath = require(path.resolve('./documentation/path/public.json'));
const adminPath = require(path.resolve('./documentation/path/admin.json'));

function getSwaggerBase(): SwaggerModel {
    switch (process.env.SWAGGER_ENV) {
        case 'staging':
            return swaggerStaging;
        case 'production':
            return swaggerProduction;
        default:
            return swaggerDev;
    }
}

export function setupSwagger(app: INestApplication): void {
    const expressApp = app.getHttpAdapter().getInstance();

    expressApp.use('/api/docs', swaggerUi.serve);
    expressApp.get(
        '/api/docs',
        (req: Request, _res: Response, next: NextFunction) => {
            const swagger: SwaggerModel = { ...getSwaggerBase() };
            swagger.paths = {
                ...authPath.paths,
                ...invitationPath.paths,
                ...guestPath.paths,
                ...rsvpPath.paths,
                ...galleryPath.paths,
                ...analyticsPath.paths,
                ...publicPath.paths,
                ...adminPath.paths
            };
            (req as any).swaggerDoc = swagger;
            next();
        },
        swaggerUi.setup()
    );
}
