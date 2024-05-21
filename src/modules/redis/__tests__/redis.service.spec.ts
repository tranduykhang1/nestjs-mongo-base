import { TestBed } from '@automock/jest';
import { RedisService } from '../redis.service';

describe('RedisService', () => {
  let redisService: RedisService;

  beforeAll(() => {
    const { unit } = TestBed.create(RedisService).compile();
    redisService = unit;
  });

  it('should be defined', () => {
    expect(redisService).toBeDefined();
  });
});
