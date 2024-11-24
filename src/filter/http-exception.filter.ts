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

    if (exception instanceof HttpException) {
      status = exception.getStatus();
    } else {
      this.logger.error(`Unexpected error occurred:, ${exception}`);
    }
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        status === HttpStatus.INTERNAL_SERVER_ERROR
          ? 'Internal Server Error'
          : (exception as any).message || 'Unexpected error occurred',
    });
  }
}
