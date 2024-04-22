import {
  CallHandler,
  ExecutionContext,
  Injectable,
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
  [HttpStatusCode.Ok]: MessageResponse.succeed,
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const status = context.switchToHttp().getResponse().statusCode;
    return next.handle().pipe(
      map((data) => ({
        status,
        message: data?.message || messageMapper[status],
        data: data?.data || data || {},
        filter: data?.filter,
        total: data?.total,
      })),
    );
  }
}
