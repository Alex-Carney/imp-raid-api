import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';
import { ValidationError } from 'class-validator';
import helmet from 'helmet';
import { LoggingInterceptor } from './common/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get ConfigService instance
  const configService = app.get(ConfigService);

  // Validation Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]): BadRequestException => {
        return new BadRequestException(errors);
      },
    }),
  );

  // app.useGlobalInterceptors(new LoggingInterceptor());

  // Enable shutdown hooks
  app.enableShutdownHooks();

  // Prisma Client Exception Filter
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  // Swagger Configuration
  const swaggerConfig = configService.get('swagger');
  if (swaggerConfig && swaggerConfig.enabled) {
    const swaggerOptions = new DocumentBuilder()
      .setTitle(swaggerConfig.title || 'IMP Raid API')
      .setDescription(swaggerConfig.description || 'API Description')
      .setVersion(swaggerConfig.version || '1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup(swaggerConfig.path || 'api', app, document);
  }

  // CORS Configuration
  const corsConfig = configService.get('cors');
  if (corsConfig && corsConfig.enabled) {
    app.enableCors({
      origin: corsConfig.origin || '*',
      methods: corsConfig.methods || 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: corsConfig.preflightContinue || false,
      optionsSuccessStatus: corsConfig.optionsSuccessStatus || 204,
    });
  }

  // Helmet
  const helmetConfig = configService.get('helmet');
  if (helmetConfig && helmetConfig.enabled) {
    app.use(helmet());
  }

  // Listen on the configured port
  const nestConfig = configService.get('nest');
  await app.listen(process.env.NEST_PORT_INTERNAL || nestConfig.port || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().then(() => console.log('API started'));
