import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LogService } from './log.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    return next
      .handle()
      .pipe(
        tap(() => {
          const responseTime = `${Date.now() - now}ms`;
          const logMessage = `${method} ${url} - Response time: ${responseTime}`;
          this.logService.create({
            level: 'OK',
            message: logMessage,
            timestamp: new Date(),
          });
          Logger.log(logMessage);
        }),
        catchError((err) => {
          const errorMessage = `${method} ${url} - Error: ${err.message}`;
          this.logService.create({
            level: 'ERROR',
            message: errorMessage,
            timestamp: new Date(),
          });
          Logger.error(errorMessage);
          return throwError(err);
        })
      );
  }
}
