import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LoggingService } from 'src/logging/logging.service';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    } else {
      this.logger.error(`Unexpected error occurred,${exception}`);
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
