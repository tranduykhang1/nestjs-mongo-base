import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';

@Injectable()
export class AspectLogger implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const logger: Logger = new Logger('AppLogger');
    const req = context.switchToHttp().getRequest();
    const { originalUrl, method, params, query, body } = req;

    logger.log({
      originalUrl,
      method,
      params,
      query,
      body,
    });

    return next.handle().pipe(tap((data) => logger.log(data)));
  }
}
