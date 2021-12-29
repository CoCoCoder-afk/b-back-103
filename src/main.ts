import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import CustomLogger from './logger/customLogger';
import * as fs from "fs";
import * as path from "path";

async function bootstrap() {
  const httpsOptions = process.env.NODE_ENV === 'production' ? {
    key: fs.readFileSync(path.resolve('/etc/letsencrypt/live/binbackbot.ru/privkey.pem')),
    cert: fs.readFileSync(path.resolve('/etc/letsencrypt/live/binbackbot.ru/fullchain.pem'))
  } : {};
  const app = await NestFactory.create(AppModule, {
      bufferLogs: true,
      httpsOptions
    });

  app.useLogger(app.get(CustomLogger));
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  app.use(cookieParser());

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: true,
    credentials: true
  });

  await app.listen(configService.get('SERVER_PORT'), configService.get('SERVER_HOST'));
}
bootstrap();
