import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
    log(context: string, message: string){
        const time = new Date().toISOString();
        console.log(`[${time}] [LOG] [${context || 'application'}] ${message}`)
    }
}
