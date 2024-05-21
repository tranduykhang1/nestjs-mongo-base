export const Errors = {
  // COMMON
  COMMON_ERROR: {
    errorCode: 12000,
    message: 'Something went wrong!',
  },
  COMMON_NOT_FOUND_ERROR: {
    errorCode: 12001,
    message: 'Resource not found!',
  },

  // AUTH
  WRONG_CREDENTIALS: {
    errorCode: 10000,
    message: 'wrong credentials!',
  },
  EMAIL_EXISTED: {
    errorCode: 10001,
  },
  LOGIN_FAILED: {
    errorCode: 10002,
    message: 'login failed!',
  },
  REGISTER_FAILED: {
    errorCode: 10003,
  },
  DUPLICATE_EMAIL: {
    errorCode: 10004,
    message: 'duplicate email!',
  },
  UNAUTHORIZED: {
    errorCode: 10005,
    message: 'unauthorized!',
  },
  SESSION_EXPIRED: {
    errorCode: 10006,
    message: 'session expired!',
  },
  MISSED_TOKEN: {
    errorCode: 10007,
    message: 'missed token!',
  },
};
