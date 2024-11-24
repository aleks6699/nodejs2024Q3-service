import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logLevelPriority: { [key: string]: number } = {
    LOG: 0,
    FATAL: 1,
    ERROR: 2,
    WARN: 3,
    DEBUG: 4,
    VERBOSE: 5,
  };

  private readonly currentLogLevel: number;

  constructor() {
    this.currentLogLevel = parseInt(process.env.LOG_LEVEL, 10) || 0;
  }

  private shouldLog(level: number): boolean {
    return level <= this.currentLogLevel;
  }

  log(message: any) {
    console.log(this.currentLogLevel);
    console.log(this.shouldLog(this.logLevelPriority.LOG));
    if (this.shouldLog(this.logLevelPriority.LOG)) {
      console.log(`[LOG] ${message}`);
    }
  }

  fatal(message: any) {
    console.log(this.shouldLog(this.logLevelPriority.LOG));

    if (this.shouldLog(this.logLevelPriority.FATAL)) {
      console.error(`[FATAL] ${message}`);
    }
  }

  error(message: any) {
    console.log(this.shouldLog(this.logLevelPriority.ERROR));

    if (this.shouldLog(this.logLevelPriority.ERROR)) {
      console.error(`[ERROR] ${message}`);
    }
  }

  warn(message: any) {
    console.log(this.shouldLog(this.logLevelPriority.WARN));

    if (this.shouldLog(this.logLevelPriority.WARN)) {
      console.warn(`[WARN] ${message}`);
    }
  }

  debug(message: any) {
    console.log(this.shouldLog(this.logLevelPriority.DEBUG));

    if (this.shouldLog(this.logLevelPriority.DEBUG)) {
      console.debug(`[DEBUG] ${message}`);
    }
  }

  verbose(message: any) {
    console.log(this.shouldLog(this.logLevelPriority.VERBOSE));

    if (this.shouldLog(this.logLevelPriority.VERBOSE)) {
      console.info(`[VERBOSE] ${message}`);
    }
  }
}
