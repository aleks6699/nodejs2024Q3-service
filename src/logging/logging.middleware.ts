import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const { method, originalUrl, body, query } = req;
      const { statusCode } = res;
      const logMessage = `Request: ${method} ${originalUrl} | Body: ${JSON.stringify(
        body,
      )} | Query: ${JSON.stringify(query)} | Status: ${statusCode}`;
      this.loggingService.log(JSON.stringify(logMessage));
    });
    next();
  }
}
