import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Request, Response } from 'express';
import { appConfig } from 'src/app.config';

type ErrorResponse = {
  errorCode: string | number;
  message: string;
  timestamp: Date;
  path: string;
  data: any;
};

@Catch(HttpException)
export class GlobalHttpException implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpException.name);

  private errorMessages = {
    'Bad Request': 'Have an error. Please try again!',
  };

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: Request = ctx.getRequest<Request>();
    const exceptionResponse: any = exception.getResponse() as Record<
      string,
      any
    >;

    const status: HttpStatus =
      exceptionResponse.statusCode || HttpStatus.BAD_REQUEST;
    const errorCode = exceptionResponse?.errorCode || status;

    let message =
      exceptionResponse?.message ||
      response.statusMessage ||
      'Have an error. Please try again!';
    message = this.errorMessages[message] || message;

    const errorResponse: ErrorResponse = {
      errorCode,
      message: Array.isArray(message) ? message[0] : message,
      timestamp: new Date(),
      path: request.url,
      data: null,
    };

    if (appConfig.nodeEnv === 'dev') {
      this.logger.error(
        `Request Method: ${request.method} Request URL: ${request.url}`,
        exception.stack,
      );

      response.status(status).json(errorResponse);
      return;
    }

    response.status(status).json(errorResponse);
  }
}
