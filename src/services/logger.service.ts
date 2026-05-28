import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { join } from 'path';

const logDir = join(process.cwd(), 'logs');
const isServerless = process.env.VERCEL === '1' || process.env.APP_ENV === 'production';

const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, context, stack }) => {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        const ctx = context ? `[${String(context)}]` : '';
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        const trace = stack ? `\n${String(stack)}` : '';
        return `${String(timestamp)} ${level.toUpperCase()} ${ctx} ${String(message)}${trace}`;
    })
);

const loggerTransports: any[] = [new transports.Console({ format: logFormat })];

if (!isServerless) {
    loggerTransports.push(
        new DailyRotateFile({
            dirname: join(logDir, 'all'),
            filename: '%DATE%.log',
            datePattern: 'YYYYMMDD',
            maxFiles: '30d',
            level: 'info'
        }),
        new DailyRotateFile({
            dirname: join(logDir, 'error'),
            filename: 'error-%DATE%.log',
            datePattern: 'YYYYMMDD',
            maxFiles: '30d',
            level: 'error'
        })
    );
}

export const fileLogger = createLogger({
    format: logFormat,
    transports: loggerTransports
});
