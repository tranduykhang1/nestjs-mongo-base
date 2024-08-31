import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Nullable } from 'src/common/types/common.type';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private client: Redis) {}

  async set<T>(key: string, value: T, ttl = -1): Promise<void> {
    if (ttl) {
      await this.client.set(key, JSON.stringify(value), 'EX', ttl);
    } else {
      await this.client.set(key, JSON.stringify(value));
    }
  }

  async get<T>(key: string): Promise<Nullable<T>> {
    const result = await this.client.get(key);
    if (result === null) {
      return null;
    }
    return JSON.parse(result);
  }

  async close(): Promise<void> {
    await this.client.quit();
  }
}
