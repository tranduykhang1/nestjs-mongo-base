const devEnv = {
  nodeEnv: process.env.NODE_ENV,
  name: process.env.APP_NAME || 'missed',
  version: process.env.APP_VERSION || 'missed',
  apiVersion: process.env.API_VERSION,
  apiPort: process.env.API_PORT,
  mongoURI: process.env.MONGO_URI || 'missed',
  jwtExpiresIn: process.env.AT_EXPIRE,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExp: process.env.RT_EXPIRE,
  fileHost: process.env.FILE_HOST,
  fileRoot: process.env.FILE_ROOT,
  pwSecret: process.env.PW_SECRET,
  baseUrl: process.env.BASE_URL,
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleSecretKey: process.env.GOOGLE_SECRET_KEY,
  apiAuthUserName: process.env.API_AUTH_USERNAME,
  apiAuthPassword: process.env.API_AUTH_PASSWORD,
  maxWorkers: process.env.MAX_WORKERS,
  throttleTTL: process.env.THROTTLE_TTL,
  throttleLimit: process.env.THROTTLE_LIMIT,
} as const;

export const testEnv = {
  nodeEnv: 'test',
  name: 'Change_me',
  version: '1.0.0',
  apiPort: 8084,
  apiVersion: '1',
  mongoURI: process.env.MONGO_URI_TEST || '',

  jwtExpiresIn: '1d',
  jwtSecret: 'CHANGE_ME-string',
  jwtRefreshSecret: 'CHANGE_ME-string',
  jwtRefreshExp: '7d',
  pwSecret: 'CHANGE_ME',
  baseUrl: 'http://localhost:8084',
  apiAuthUserName: process.env.API_AUTH_USERNAME,
  apiAuthPassword: process.env.API_AUTH_PASSWORD,
  maxWorkers: '1',
  throttleTTL: process.env.THROTTLE_TTL,
  throttleLimit: process.env.THROTTLE_LIMIT,
} as const;

export const appConfig =
  process.env.NODE_ENV === 'test' || process.env.NODE_ENV === undefined
    ? testEnv
    : devEnv;
