import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
    constructor(private readonly service: AuditService){}

    @Get()
    record(@Query('id') id: string,  @Query('action') action: string){
        return this.service.record(Number(id), action ?? 'unknown');
    }
}
