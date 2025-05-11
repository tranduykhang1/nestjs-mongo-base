import * as dotenv from 'dotenv';
dotenv.config();

type EnvConfig = {
  nodeEnv: string | undefined;
  name: string;
  version: string;
  apiVersion: string;
  apiPort: string | number;
  pgHost: string | undefined;
  pgPort: number;
  pgUser: string | undefined;
  pgPassword: string | undefined;
  pgDatabase: string | undefined;
  jwtExpiresIn: string;
  jwtSecret: string;
  jwtRefreshSecret: string;
  jwtRefreshExp: string;
  pwSecret: string;
  baseUrl: string;
  apiAuthUserName: string | undefined;
  apiAuthPassword: string | undefined;
  maxWorkers: string | undefined;
  throttleTTL: number;
  throttleLimit: number;
  redisPass: string;
  redisHost: string;
  redisPort: string | number;
  redisDB: number | string;
  supportEmailPw: string;
  supportEmail: string;
  minioRootUser: string;
  minioRootPassword: string;
};

const devEnv: EnvConfig = {
  nodeEnv: process.env.NODE_ENV,
  name: process.env.APP_NAME || 'AppName',
  version: process.env.APP_VERSION || '0.0.1',
  apiVersion: process.env.API_VERSION || '1',
  apiPort: process.env.API_PORT || 3000,
  pgHost: process.env.PG_HOST || 'db',
  pgPort: +process.env.PG_PORT! || 5432,
  pgUser: process.env.PG_USER || 'adminhelp',
  pgPassword: process.env.PG_PASSWORD || 'secretadminhelp',
  pgDatabase: process.env.PG_DATABASE || 'main',
  jwtExpiresIn: process.env.AT_EXPIRE || '1d',
  jwtSecret: process.env.JWT_SECRET || 'defaultSecret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'defaultRefreshSecret',
  jwtRefreshExp: process.env.RT_EXPIRE || '7d',
  pwSecret: process.env.PW_SECRET || 'defaultPWSecret',
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  apiAuthUserName: process.env.API_AUTH_USERNAME,
  apiAuthPassword: process.env.API_AUTH_PASSWORD,
  maxWorkers: process.env.MAX_WORKERS || '1',
  throttleTTL: +process.env.THROTTLE_TTL! || 60,
  throttleLimit: +process.env.THROTTLE_LIMIT! || 10,
  redisPass: process.env.REDIS_PASSWORD || 'defaultRedisPass',
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: process.env.REDIS_PORT || 6379,
  redisDB: process.env.REDIS_DB || 0,
  supportEmailPw: process.env.SUPPORT_EMAIL_PW!,
  supportEmail: process.env.SUPPORT_EMAIL!,
  minioRootUser: process.env.MINIO_ROOT_USER || 'minioadmin',
  minioRootPassword: process.env.MINIO_ROOT_PASSWORD || 'minioadmin',
};

const testEnv: EnvConfig = {
  nodeEnv: 'test',
  name: 'TestApp',
  version: '1.0.0',
  apiVersion: '1',
  apiPort: 8084,
  pgHost: 'localhost',
  pgPort: 5432,
  pgUser: 'postgres',
  pgPassword: 'postgres',
  pgDatabase: 'test',
  jwtExpiresIn: '1d',
  jwtSecret: 'testSecret',
  jwtRefreshSecret: 'testRefreshSecret',
  jwtRefreshExp: '7d',
  pwSecret: 'testPWSecret',
  baseUrl: 'http://localhost:8084',
  apiAuthUserName: 'admin',
  apiAuthPassword: 'admin',
  maxWorkers: '1',
  throttleTTL: 10,
  throttleLimit: 20,
  redisPass: 'redis-secret',
  redisHost: 'localhost',
  redisPort: 6380,
  redisDB: 1,
  supportEmailPw: 'pw',
  supportEmail: 'email@email.com',
  minioRootUser: 'minioadmin',
  minioRootPassword: 'minioadmin',
};

export const appConfig: EnvConfig =
  process.env.NODE_ENV &&
  ['test', 'e2e-test'].includes(process.env.NODE_ENV!.toString())
    ? testEnv
    : devEnv;
