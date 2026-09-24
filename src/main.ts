import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './configs/all-exceptions.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // <-- removido instrument

  // Configuração Swagger
  const config = new DocumentBuilder()
    .setTitle('API NestJS')
    .setDescription('Documentação da API com Swagger')
    .setVersion('1.0')
    .addBearerAuth() // habilita autenticação JWT no Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // remove campos não definidos no DTO
    forbidNonWhitelisted: true, // erro se enviar campos extras
    transform: true, // transforma tipos automaticamente
  }));
  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors();
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
