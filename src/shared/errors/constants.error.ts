import { HttpStatus } from '@nestjs/common';

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
  TOO_MANY_REQUEST: {
    errorCode: 12002,
    message: 'Too many request!',
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
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
    statusCode: HttpStatus.CONFLICT,
  },
  UNAUTHORIZED: {
    errorCode: 10005,
    message: 'unauthorized!',
    statusCode: HttpStatus.UNAUTHORIZED,
  },
  SESSION_EXPIRED: {
    errorCode: 10006,
    message: 'session expired!',
  },
  MISSED_TOKEN: {
    errorCode: 10007,
    message: 'missed token!',
  },
  LOGIN_WITH_ANOTHER_DEVICE: {
    errorCode: 10008,
    message: 'login with another device!',
  },
  INVALID_SESSION: {
    errorCode: 10009,
    message: 'invalid session!',
  },
};
