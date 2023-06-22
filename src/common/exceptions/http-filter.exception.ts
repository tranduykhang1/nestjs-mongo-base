import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
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

    const statusCode = resp?.statusCode || 500;
    const message = resp?.message || 'Server Error!';

    const devErrResp: any = {
      statusCode: statusCode,
      message: Array.isArray(message)
        ? message[0]
        : message?.message ||
          message?.message ||
          message ||
          'Interval server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // const prodErrResp: any = {
    //   statusCode,
    //   message,
    // };

    this.logger.log(
      `request method: ${request.method} request url${request.url}`,
      devErrResp,
    );
    response.status(statusCode).json(devErrResp);
  }
}
