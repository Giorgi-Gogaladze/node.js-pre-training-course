import { Injectable } from "@nestjs/common";

@Injectable()
export class LoggerService {
    log(context: string, message: string): void {
        const time = new Date().toISOString();
        console.log(`${time} ${context}: ${message}`);
    }
}