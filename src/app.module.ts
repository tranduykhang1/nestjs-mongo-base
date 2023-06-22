import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { SoftDelete } from 'soft-delete-mongoose-plugin';
import { appConfig } from './app.config';
import { HttpExceptionFilter } from './common/exceptions/http-filter.exception';
import { AspectLogger } from './common/interceptors/log.interceptor';
import { AppLoggerMiddleware } from './common/middleware/logging.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/role.guard';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(appConfig.mongoURI),
    AuthModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AspectLogger,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }

  constructor() {
    console.log({ appConfig });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    mongoose.plugin(require('mongoose-nanoid'), {
      length: 12,
      alphabets: '1234567890',
    });

    mongoose.plugin(
      new SoftDelete({
        isDeletedField: 'isDeleted',
        deletedAtField: 'deletedAt',
      }).getPlugin(),
    );
  }
}
