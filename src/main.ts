import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import { appConfig } from './app.config';
import { AppModule } from './app.module';
import logger from './common/logger/winston.logger';
import { AppClusterConfig } from './utils/app-cluster-config';
import { ApiDocProtected } from './utils/swagger.auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: logger,
    }),
  });
  const httpAdapter = app.getHttpAdapter();

  app.setGlobalPrefix(`api`);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const authApiDoc = new ApiDocProtected(httpAdapter);
  authApiDoc.enabled();

  const config = new DocumentBuilder()
    .setTitle(appConfig.name)
    .setVersion(appConfig.version)
    .addBearerAuth()
    .setContact('John Doe', '', 'johndoe@gmail.com')
    .build();

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}

appConfig.nodeEnv === 'dev' ? bootstrap() : AppClusterConfig.enabled(bootstrap);
