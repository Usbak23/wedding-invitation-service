import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { fileLogger } from '../services/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const start = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - start;
      const msg = `${method} ${originalUrl} ${res.statusCode} - ${ms}ms - ${ip}`;
      this.logger.log(msg);
      fileLogger.info(msg, { context: 'HTTP' });
    });
    next();
  }
}
