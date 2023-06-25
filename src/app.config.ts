const devEnv = {
  env: process.env.NODE_ENV,
  name: process.env.APP_NAME,
  version: process.env.APP_VERSION,
  apiVersion: process.env.API_VERSION,
  mongoURI: process.env.MONGO_URI,
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
};

const testEnv = {
  env: process.env.NODE_ENV,
  name: 'example',
  version: '1.0.0',
  apiVersion: '1',
  mongoURI: '',

  jwtExpiresIn: '1d',
  jwtSecret: 'example-string',
  jwtRefreshSecret: 'example-string',
  jwtRefreshExp: '7d',
  pwSecret: 'example',
  baseUrl: 'http://localhost:3003',
};

export const appConfig = process.env.NODE_ENV === 'test' ? testEnv : devEnv;
