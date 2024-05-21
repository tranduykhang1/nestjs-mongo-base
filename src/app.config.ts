type EnvConfig = {
  nodeEnv: string | undefined;
  name: string;
  version: string;
  apiVersion: string;
  apiPort: string | number;
  mongoURI: string;
  mongoPort: string | number;
  jwtExpiresIn: string;
  jwtSecret: string;
  jwtRefreshSecret: string;
  jwtRefreshExp: string;
  fileHost: string | undefined;
  fileRoot: string | undefined;
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
};

const devEnv: EnvConfig = {
  nodeEnv: process.env.NODE_ENV,
  name: process.env.APP_NAME || 'AppName',
  version: process.env.APP_VERSION || '0.0.1',
  apiVersion: process.env.API_VERSION || '1',
  apiPort: process.env.API_PORT || 3000,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/dev_db',
  mongoPort: process.env.MONGO_PORT || 27017,
  jwtExpiresIn: process.env.AT_EXPIRE || '1d',
  jwtSecret: process.env.JWT_SECRET || 'defaultSecret',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'defaultRefreshSecret',
  jwtRefreshExp: process.env.RT_EXPIRE || '7d',
  fileHost: process.env.FILE_HOST,
  fileRoot: process.env.FILE_ROOT,
  pwSecret: process.env.PW_SECRET || 'defaultPWSecret',
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  apiAuthUserName: process.env.API_AUTH_USERNAME,
  apiAuthPassword: process.env.API_AUTH_PASSWORD,
  maxWorkers: process.env.MAX_WORKERS || '1',
  throttleTTL: +process.env.THROTTLE_TTL!,
  throttleLimit: +process.env.THROTTLE_LIMIT!,
  redisPass: process.env.REDIS_PASSWORD || 'defaultRedisPass',
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: process.env.REDIS_PORT || 6379,
};

const testEnv: EnvConfig = {
  nodeEnv: 'test',
  name: 'TestApp',
  version: '1.0.0',
  apiVersion: '1',
  apiPort: 8084,
  mongoURI:
    'mongodb://superadmin:secret-admin-string@localhost:27030/test?authSource=admin&directConnection=true',
  mongoPort: 27017,
  jwtExpiresIn: '1d',
  jwtSecret: 'testSecret',
  jwtRefreshSecret: 'testRefreshSecret',
  jwtRefreshExp: '7d',
  fileHost: undefined,
  fileRoot: undefined,
  pwSecret: 'testPWSecret',
  baseUrl: 'http://localhost:8084',
  apiAuthUserName: 'admin',
  apiAuthPassword: 'admin',
  maxWorkers: '1',
  throttleTTL: 10,
  throttleLimit: 20,
  redisPass: 'testRedisPass',
  redisHost: 'localhost',
  redisPort: 6379,
};

export const appConfig: EnvConfig =
  process.env.NODE_ENV &&
  ['test', 'e2e-test'].includes(process.env.NODE_ENV!.toString())
    ? testEnv
    : devEnv;
