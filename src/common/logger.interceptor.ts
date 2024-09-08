import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    const now = Date.now();

    // Handle the request and log after it's handled
    return next.handle().pipe(
      tap((response) => {
        const apiKey = request.headers['authorization']?.split(' ')[1];
        const responseTime = Date.now() - now;
        this.logger.log(
          `Completed ${method} ${url} - Response Time: ${responseTime}ms - API Key: ${apiKey || 'None'}`,
        );
        this.logger.debug(`Response: ${JSON.stringify(response)}`);
      }),
    );
  }
}
