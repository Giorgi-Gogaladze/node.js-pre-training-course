import { Controller, Get, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { LoggingGuard } from './logging.guard';
import { LoggingInterceptor } from './logging.interceptor';
import { LoggingPipe } from './logging.pipe';

@Controller('lifecycle')
export class LifecycleController {
    @Get(":id")
    @UseGuards(LoggingGuard)
    @UseInterceptors(LoggingInterceptor)
    handle(@Param('id', LoggingPipe) id: number){
        console.log(`handler: executing with id=${id} (type: ${typeof id})`);
        return {id, type: typeof id}
    }
}
