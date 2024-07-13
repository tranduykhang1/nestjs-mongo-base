import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageResponse } from 'src/shared/responses/message.response';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

const messageMapper = {
  [HttpStatusCode.Created]: MessageResponse.created,
  [HttpStatusCode.Ok]: MessageResponse.success,
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  private readonly logger = new Logger(ResponseInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const status = context.switchToHttp().getResponse().statusCode;
    this.logger.log(
      `✨ Request Success: [${request.user?.uid}] - ${request.method} - ${request.url}`,
    );

    return next.handle().pipe(
      map((data) => {
        return {
          status,
          message: data?.message || messageMapper[status],
          data: data?.data || data || {},
          filter: data?.filter,
          total: data?.total,
        };
      }),
    );
  }
}
