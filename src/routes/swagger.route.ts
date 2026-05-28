import { INestApplication } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import * as path from 'path';
import { SwaggerModel } from '../interfaces/swagger.interface';

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const swaggerDev: SwaggerModel = require(path.resolve('./documentation/swagger.json'));
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const swaggerStaging: SwaggerModel = require(path.resolve('./documentation/swaggerStaging.json'));
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const swaggerProduction: SwaggerModel = require(path.resolve('./documentation/swaggerProduction.json'));

// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const authPath: { paths: Record<string, object> } = require(path.resolve('./documentation/path/auth.json'));
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const invitationPath: { paths: Record<string, object> } = require(path.resolve('./documentation/path/invitation.json'));
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const guestPath: { paths: Record<string, object> } = require(path.resolve('./documentation/path/guest.json'));
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const rsvpPath: { paths: Record<string, object> } = require(path.resolve('./documentation/path/rsvp.json'));
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const galleryPath: { paths: Record<string, object> } = require(path.resolve('./documentation/path/gallery.json'));
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const analyticsPath: { paths: Record<string, object> } = require(path.resolve('./documentation/path/analytics.json'));
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const publicPath: { paths: Record<string, object> } = require(path.resolve('./documentation/path/public.json'));
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
const adminPath: { paths: Record<string, object> } = require(path.resolve('./documentation/path/admin.json'));

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const expressApp = app.getHttpAdapter().getInstance();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    expressApp.use('/api/docs', swaggerUi.serve);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (req as any).swaggerDoc = swagger;
            next();
        },
        swaggerUi.setup()
    );
}
