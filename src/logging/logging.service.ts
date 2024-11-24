import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';

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

  private readonly currentLogLevel: number =
    parseInt(process.env.LOG_LEVEL, 10) || 0;
  private readonly sizeFileLogs: number =
    parseInt(process.env.SIZE_FILE_LOGS, 10) || 0;

  private shouldLog(level: number): boolean {
    return level <= this.currentLogLevel;
  }

  log(message: any) {
    if (this.shouldLog(this.logLevelPriority.LOG)) {
      const messageLogs = `[LOG] ${message}`;
      this.writeLoggingMessageToConsole(messageLogs);
      this.recordLog(messageLogs, 'log');
    }
  }

  fatal(message: any) {
    if (this.shouldLog(this.logLevelPriority.FATAL)) {
      const messageLogs = `[FATAL] ${message}`;
      this.writeLoggingMessageToConsole(messageLogs);
      this.recordLog(messageLogs, 'fatal');
    }
  }

  error(message: any) {
    if (this.shouldLog(this.logLevelPriority.ERROR)) {
      const messageLogs = `[ERROR] ${message}`;
      this.writeLoggingMessageToConsole(messageLogs);
      this.recordLog(messageLogs, 'error');
    }
  }

  warn(message: any) {
    if (this.shouldLog(this.logLevelPriority.WARN)) {
      const messageLogs = `[WARN] ${message}`;
      this.writeLoggingMessageToConsole(messageLogs);
      this.recordLog(messageLogs, 'warn');
    }
  }

  debug(message: any) {
    if (this.shouldLog(this.logLevelPriority.DEBUG)) {
      const messageLogs = `[DEBUG] ${message}`;
      this.writeLoggingMessageToConsole(messageLogs);
      this.recordLog(messageLogs, 'debug');
    }
  }

  verbose(message: any) {
    if (this.shouldLog(this.logLevelPriority.VERBOSE)) {
      const messageLogs = `[VERBOSE] ${message}`;
      this.writeLoggingMessageToConsole(messageLogs);
      this.recordLog(messageLogs, 'verbose');
    }
  }
  private writeLoggingMessageToConsole(message: any) {
    const { stdout } = process;
    stdout.write(message);
  }

  private recordLog(message: any, type: string) {
    const logMessage = `[${new Date().toISOString()}] [${type}] ${message}\n`;
    const logFilePath = `./logs/${type}.log`;

    if (!fs.existsSync('./logs')) {
      fs.mkdirSync('./logs', { recursive: true });
    }

    fs.appendFileSync(logFilePath, logMessage);

    const stat = fs.statSync(logFilePath);
    if (stat.size > this.sizeFileLogs * 1024) {
      for (let i = 5; i > 0; i--) {
        const oldFile = `./logs/${type}.log.${i}`;
        const newerFile = i === 1 ? logFilePath : `./logs/${type}.log.${i - 1}`;
        if (fs.existsSync(newerFile)) {
          fs.renameSync(newerFile, oldFile);
        }
      }
    }
  }
}
