import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        console.log('INTERCEPTOR: before handler');
        const start = Date.now();

        return next.handle().pipe(
            tap(() => {
                console.log(`INTERCEPTOR: after handler (${Date.now() - start}ms)`)
            })
        )
    }
}