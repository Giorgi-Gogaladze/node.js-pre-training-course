import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class LoggingGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean {
        console.log("GUARD: checking access");

        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];

        if(apiKey !== 'secret'){
            console.log('GUARD: access denied');
            throw new ForbiddenException('invalid of missing x-api-key');
        }
        console.log("GUARD: access granted");
        return true;
    }
}