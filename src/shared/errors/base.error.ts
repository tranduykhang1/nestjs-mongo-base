import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomError } from './interface.error';

/**
 @constructor 
 @message the error message
 @errorCode the custom error code
 @statusCode the http status code (default HttpStatus.BAD_REQUEST)
 */
export class BaseError extends HttpException {
  constructor({
    errorCode,
    message = '',
    statusCode = HttpStatus.BAD_REQUEST,
  }: CustomError) {
    super(
      {
        errorCode,
        message: message || '',
        statusCode,
      },
      statusCode,
    );
  }
}
