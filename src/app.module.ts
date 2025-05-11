import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { appConfig } from './app.config';
import { GlobalHttpException } from './common/exceptions/globalHttp.exception';
import { AppThrottlerGuard } from './common/guards/appThrottle.guard';
import { AspectLogger } from './common/interceptors/log.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/role.guard';
import { BullQueueModule } from './modules/bull-queue/bull-queue.module';
import { HeathModule } from './modules/heath/heath.module';
import { MailingModule } from './modules/mailing/mailing.module';
import { RedisModule } from './modules/redis/redis.module';
import { UserSessionsModule } from './modules/user-sessions/user-sessions.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: appConfig.pgHost,
      port: appConfig.pgPort,
      username: appConfig.pgUser,
      password: appConfig.pgPassword,
      database: appConfig.pgDatabase,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
      migrations: ['src/migrations/*.ts', 'dist/migrations/*{.ts,.js}'],
      migrationsRun: true,
    }),
    ThrottlerModule.forRoot([
      { ttl: +appConfig.throttleTTL * 1000, limit: +appConfig.throttleLimit },
    ]),
    AuthModule,
    UsersModule,
    RedisModule,
    HeathModule,
    BullQueueModule,
    MailingModule,
    // FirebaseLibModule,
    UserSessionsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_FILTER, useClass: GlobalHttpException },
    { provide: APP_INTERCEPTOR, useClass: AspectLogger },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: AppThrottlerGuard },
  ],
})
export class AppModule {
  constructor() {
    console.log(appConfig);
  }
}
