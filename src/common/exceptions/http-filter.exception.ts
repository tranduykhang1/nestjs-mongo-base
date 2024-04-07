import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { appConfig } from 'src/app.config';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private err = {
    'Bad Request': 'Have an error. Please try again!',
  } as const;

  private readonly logger: Logger;
  constructor() {
    this.logger = new Logger();
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let resp: any = exception.getResponse();

    resp = resp?.response || resp;

    const status: HttpStatus =
      typeof resp === 'string'
        ? HttpStatus.TOO_MANY_REQUESTS
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const statusCode = resp?.statusCode || status;
    let message = resp?.message || resp || 'Have an error. Please try again!';

    message = this.err[message] || message;

    const devErrResp: any = {
      statusCode: statusCode,
      message: Array.isArray(message)
        ? message[0]
        : message?.message || message?.message || message,
      timestamp: new Date().toISOString(),
      path: request.url,
      data: null,
    };

    const prodErrResp: any = {
      statusCode: statusCode,
      message: Array.isArray(message)
        ? message[0]
        : message?.message || message?.message || message,
      data: null,
    };

    const errRes = appConfig.env === 'dev' ? devErrResp : prodErrResp;

    this.logger.error(
      `request method: ${request.method} request url${request.url}`,
      devErrResp,
    );
    response.status(statusCode).json(errRes);
  }
}
