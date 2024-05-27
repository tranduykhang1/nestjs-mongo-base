import { RedisModule as IORedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { appConfig } from 'src/app.config';
import { RedisController } from './redis.controller';
import { RedisService } from './redis.service';

@Module({
  imports: [
    IORedisModule.forRoot({
      type: 'single',
      options: {
        host: appConfig.redisHost,
        port: +appConfig.redisPort,
        username: 'default',
        password: appConfig.redisPass,
        db: +appConfig.redisDB,
      },
    }),
  ],
  controllers: [RedisController],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
