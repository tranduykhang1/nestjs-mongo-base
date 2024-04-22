import { RedisModule as IORedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { appConfig } from 'src/app.config';
import { RedisController } from './redis.controller';
import { RedisService } from './redis.service';

@Module({
  imports: [
    IORedisModule.forRoot({
      type: 'single',
      // url: `redis://default:${appConfig.redisPass}@${appConfig.redisHost}:${appConfig.redisPort}`,
      options: {
        host: appConfig.redisHost,
        port: +appConfig.redisPort,
        username: 'default',
        password: appConfig.redisPass,
        db: 0,
      },
    }),
  ],
  controllers: [RedisController],
  providers: [RedisService],
})
export class RedisModule {}
