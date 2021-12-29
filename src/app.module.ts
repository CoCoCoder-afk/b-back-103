import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database/database.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { UsersModule } from './users/users.module';
import { ScheduleModule } from '@nestjs/schedule';
import { Timestamp } from './utils/scalars/timestamp.scalar';
import LogsMiddleware from './utils/logs.middleware';
import { LoggerModule } from './logger/logger.module';
import {DosAttackModule} from "./dosAttack/dosAttack.module";
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from "path";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        PORT: Joi.number(),
        FRONTEND_URL: Joi.string()
      })
    }),
    DatabaseModule,
    DosAttackModule,
    AuthenticationModule,
    UsersModule,
    LoggerModule,
  ],
  controllers: [],
  providers: [Timestamp],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogsMiddleware)
      .forRoutes('*');
  }
}
