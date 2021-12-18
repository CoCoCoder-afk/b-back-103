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
    key: fs.readFileSync(path.resolve(__dirname + './../secrets/privatekey.key')),
    cert: fs.readFileSync(path.resolve(__dirname + './../secrets/certificate.crt'))
  } : {};
  const app = process.env.NODE_ENV === 'production' ?
    await NestFactory.create(AppModule, {
      bufferLogs: true,
      httpsOptions
    })
    :
    await NestFactory.create(AppModule, {
      bufferLogs: true,
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