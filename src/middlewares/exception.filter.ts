import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger('ExceptionFilter');

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception instanceof HttpException ? (exception.getResponse() as any)?.message || exception.message : 'Internal server error';

        const errorResponse = {
            success: false,
            statusCode: status,
            message: Array.isArray(message) ? message[0] : message,
            path: req.url,
            timestamp: new Date().toISOString()
        };

        if (status >= 500) {
            this.logger.error(`${req.method} ${req.url} ${status} - ${exception instanceof Error ? exception.message : 'Unknown error'}`, exception instanceof Error ? exception.stack : undefined);
        }

        res.status(status).json(errorResponse);
    }
}
