import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { LoggingMiddleware } from './logging.middleware';

@Module({
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
