import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: 'http://localhost:5173', // ili '*' samo za razvoj
    credentials: true, // ako koristiš cookies
  });

  await app.listen(3000);
}
bootstrap();
