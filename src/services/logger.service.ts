import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { join } from 'path';

const logDir = join(process.cwd(), 'logs');

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message, context, stack }) => {
    const ctx = context ? `[${context}]` : '';
    const trace = stack ? `\n${stack}` : '';
    return `${timestamp} ${level.toUpperCase()} ${ctx} ${message}${trace}`;
  }),
);

export const fileLogger = createLogger({
  format: logFormat,
  transports: [
    new DailyRotateFile({
      dirname: join(logDir, 'all'),
      filename: '%DATE%.log',
      datePattern: 'YYYYMMDD',
      maxFiles: '30d',
      level: 'info',
    }),
    new DailyRotateFile({
      dirname: join(logDir, 'error'),
      filename: 'error-%DATE%.log',
      datePattern: 'YYYYMMDD',
      maxFiles: '30d',
      level: 'error',
    }),
  ],
});
