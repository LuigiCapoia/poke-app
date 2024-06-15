import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LogService } from '../log/log.service';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  constructor(private logService: LogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        catchError(err => {
          if (err instanceof HttpException) {
            this.logService.create({ level: 'error', message: err.message, timestamp: new Date() });
          }
          return throwError(err);
        }),
      );
  }
}
