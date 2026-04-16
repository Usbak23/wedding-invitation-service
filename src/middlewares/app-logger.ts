import { ConsoleLogger, LogLevel } from '@nestjs/common';
import { fileLogger } from '../services/logger.service';

export class AppLogger extends ConsoleLogger {
    log(message: string, context?: string) {
        super.log(message, context);
        fileLogger.info(message, { context });
    }

    error(message: string, stack?: string, context?: string) {
        super.error(message, stack, context);
        fileLogger.error(message, { context, stack });
    }

    warn(message: string, context?: string) {
        super.warn(message, context);
        fileLogger.warn(message, { context });
    }
}
