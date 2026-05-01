import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API documentation for the Task Management application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // ✅ Correct Swagger path
  SwaggerModule.setup('api/docs', app, document);

  const port = 5050;
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}/api`);
  logger.log(`Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { Logger, ValidationPipe } from '@nestjs/common';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// const logger = new Logger('Bootstrap');

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.setGlobalPrefix('api');
//   app.useGlobalPipes(new ValidationPipe());

//   const config = new DocumentBuilder()
//     .setTitle('Task Management API')
//     .setDescription('API documentation for the Task Management application')
//     .setVersion('1.0')
//     .addBearerAuth()
//     .build();

//     const document = await SwaggerModule.createDocument(app, config);
//     SwaggerModule.setup('/apiapi/docs', app, document);

//   const port = Number(5050);
//   await app.listen(port);
//   logger.log(`Application is running on: http://localhost:${port}/api`);
//   logger.log(`Swagger docs: http://localhost:${port}/api-docs`);
// }
// bootstrap();
