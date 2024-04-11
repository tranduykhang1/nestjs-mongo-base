import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from './constants.error';

export interface CustomError {
  errorCode: ErrorCode;
  message?: string;
  statusCode?: HttpStatus;
}
