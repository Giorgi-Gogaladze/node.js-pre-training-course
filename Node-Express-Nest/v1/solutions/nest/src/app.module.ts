import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MathModule } from './task-one/math/math.module';
import { LoggerModule } from './task-one/logger/logger.module';
import { AuditModule } from './task-two/audit/audit.module';
import { LifecycleModule } from './lifecycle/lifecycle.module';

@Module({
  imports: [MathModule, LoggerModule, AuditModule, LifecycleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
