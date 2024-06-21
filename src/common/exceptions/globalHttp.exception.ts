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
import { appConfig } from '../../app.config';

type ErrorResponse = {
  errorCode: number;
  message: string;
  timestamp: Date;
  path: string;
  data: any;
};

@Catch(HttpException)
export class GlobalHttpException implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpException.name);

  private readonly errorMessages = {
    'Bad Request': 'Have an error. Please try again!',
    'Internal Server Error': 'Have an error. Please try again!',
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
      exceptionResponse.statusCode ?? HttpStatus.BAD_REQUEST;
    const errorCode = exceptionResponse?.errorCode ?? status;

    const message =
      this.errorMessages[
        exceptionResponse?.message ?? response.statusMessage
      ] ?? this.errorMessages['Bad Request'];

    const errorResponse: ErrorResponse = {
      errorCode,
      message: Array.isArray(message) ? message[0] : message,
      timestamp: new Date(),
      path: request.url,
      data: null,
    };

    if (appConfig.nodeEnv === 'dev') {
      this.handleDevEnvironment(
        request,
        exception,
        errorResponse,
        response,
        status,
      );
      return;
    }

    this.handleProdEnvironment(errorResponse, response, status);
  }

  private handleDevEnvironment(
    request: Request,
    exception: HttpException,
    errorResponse: ErrorResponse,
    response: Response,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    this.logger.error(
      `Request Method: ${request.method} Request URL: ${request.url}`,
      exception.stack,
    );

    response.status(status).json(errorResponse);
  }

  private handleProdEnvironment(
    errorResponse: ErrorResponse,
    response: Response,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    response.status(status).json({
      errorCode: errorResponse.errorCode,
      message: errorResponse.message,
      path: errorResponse.path,
    });
  }
}
