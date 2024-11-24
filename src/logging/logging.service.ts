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
      const messageLogs = `[LOG] ${message}`;
      this.writeLoggingMessageToConsole(messageLogs);
    }
  }

  fatal(message: any) {
    console.log(this.shouldLog(this.logLevelPriority.LOG));

    if (this.shouldLog(this.logLevelPriority.FATAL)) {
      const messageLogs = `[FATAL] ${message}`;
      this.writeLoggingMessageToConsole(messageLogs);
    }
  }

  error(message: any) {
    console.log(this.shouldLog(this.logLevelPriority.ERROR));

    if (this.shouldLog(this.logLevelPriority.ERROR)) {
      const messageLogs = `[ERROR] ${message}`;
      this.writeLoggingMessageToConsole(messageLogs);
    }
  }

  warn(message: any) {
    console.log(this.shouldLog(this.logLevelPriority.WARN));

    if (this.shouldLog(this.logLevelPriority.WARN)) {
      const messageLogs = `[WARN] ${message}`;
      this.writeLoggingMessageToConsole(messageLogs);
    }
  }

  debug(message: any) {
    console.log(this.shouldLog(this.logLevelPriority.DEBUG));

    if (this.shouldLog(this.logLevelPriority.DEBUG)) {
      const messageLogs = `[DEBUG] ${message}`;
      this.writeLoggingMessageToConsole(messageLogs);
    }
  }

  verbose(message: any) {
    console.log(this.shouldLog(this.logLevelPriority.VERBOSE));

    if (this.shouldLog(this.logLevelPriority.VERBOSE)) {
      const messageLogs = `[VERBOSE] ${message}`;
      this.writeLoggingMessageToConsole(messageLogs);
    }
  }
  private writeLoggingMessageToConsole(message: any) {
    const { stdout } = process;
    stdout.write(message);
  }
}
