import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import mongoose from 'mongoose';
import { appConfig } from './app.config';
import { GlobalHttpException } from './common/exceptions/globalHttp.exception';
import { AppThrottlerGuard } from './common/guards/appThrottle.guard';
import { AspectLogger } from './common/interceptors/log.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/role.guard';
import { HeathModule } from './modules/heath/heath.module';
import { RedisModule } from './modules/redis/redis.module';
import { UsersModule } from './modules/users/users.module';
import { BullQueueModule } from './modules/bull-queue/bull-queue.module';
import { MailingModule } from './modules/mailing/mailing.module';

@Module({
  imports: [
    MongooseModule.forRoot(appConfig.mongoURI),
    ThrottlerModule.forRoot([
      {
        ttl: +appConfig.throttleTTL * 1000,
        limit: +appConfig.throttleLimit,
      },
    ]),
    AuthModule,
    UsersModule,
    RedisModule,
    HeathModule,
    BullQueueModule,
    MailingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalHttpException,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AspectLogger,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AppThrottlerGuard,
    },
  ],
})
export class AppModule {
  constructor() {
    console.log({ env: appConfig });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    mongoose.plugin(require('mongoose-nanoid'), {
      length: 21,
      alphabets: '1234567890',
    });
  }
}
