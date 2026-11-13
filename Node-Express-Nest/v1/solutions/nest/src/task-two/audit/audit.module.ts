import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { UserModule } from '../user/user.module';

@Module({
  providers: [AuditService],
  controllers: [AuditController],
  imports: [UserModule]
})
export class AuditModule {}
