import { HttpStatus } from '@nestjs/common';

export interface CustomError {
  errorCode: number;
  message?: string;
  statusCode?: HttpStatus;
}
