import { NestFactory } from '@nestjs/core';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import 'dotenv/config';
import { LoggingService } from './logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const yamlDocument = yaml.load(
    fs.readFileSync('./doc/api.yaml', 'utf8'),
  ) as OpenAPIObject;
  SwaggerModule.setup('doc', app, yamlDocument);

  const logger = app.get(LoggingService);
  app.useLogger(logger);

  logger.log('Server started.');

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
