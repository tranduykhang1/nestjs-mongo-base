import { Redis } from 'ioredis';
import { RedisService } from '../redis.service';

describe('RedisService', () => {
  let redisService: RedisService;
  let mockClient: jest.Mocked<Redis>;

  beforeEach(() => {
    mockClient = {
      set: jest.fn(),
      get: jest.fn(),
      quit: jest.fn(),
    } as any;

    redisService = new RedisService(mockClient);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await redisService.close();
  });

  describe('set', () => {
    it('should set a key-value pair with an expiry', async () => {
      const key = 'testKey';
      const value = { data: 'some data' };
      const ttl = 100;

      await redisService.set(key, value, ttl);

      expect(mockClient.set).toHaveBeenCalledWith(
        key,
        JSON.stringify(value),
        'EX',
        ttl,
      );
    });

    it('should set a key-value pair without an expiry', async () => {
      const key = 'anotherKey';
      const value = { anotherData: 'different data' };

      await redisService.set(key, value);

      expect(mockClient.set).toHaveBeenCalledWith(
        key,
        JSON.stringify(value),
        'EX',
        -1,
      );
    });
  });

  describe('get', () => {
    it('should return the value for a valid key', async () => {
      const key = 'existingKey';
      const value = { retrievedData: 'retrieved information' };
      mockClient.get.mockResolvedValueOnce(JSON.stringify(value));

      const retrievedValue = await redisService.get(key);

      expect(retrievedValue).toEqual(value);
      expect(mockClient.get).toHaveBeenCalledWith(key);
    });

    it('should return null for a non-existent key', async () => {
      const key = 'missingKey';
      mockClient.get.mockResolvedValueOnce(null);

      const retrievedValue = await redisService.get(key);

      expect(retrievedValue).toBeNull();
      expect(mockClient.get).toHaveBeenCalledWith(key);
    });
  });
});
