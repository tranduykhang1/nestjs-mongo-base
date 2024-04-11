import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs';
import { appConfig } from 'src/app.config';

@Injectable()
export class AspectLogger implements NestInterceptor {
  logger = new Logger(AspectLogger.name);
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { ip, originalUrl: url, method, params, query, body } = req;
    const statusCode: HttpStatus = res?.statusCode;

    const start = new Date().getTime();

    const isDev = appConfig.nodeEnv === 'dev';

    return next.handle().pipe(
      tap(() => {
        const duration = new Date().getTime() - start;

        isDev
          ? this.logger.verbose(
              `${ip} - ${method} - ${url} - ${statusCode} - ${duration}ms`,
            )
          : this.logger.verbose({
              ip,
              method,
              url,
              statusCode,
              duration,
              params,
              query,
              body,
            });
      }),
    );
  }
}
