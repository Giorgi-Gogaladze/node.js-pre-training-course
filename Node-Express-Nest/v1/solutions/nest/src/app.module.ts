import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MathModule } from './task-one/math/math.module';
import { LoggerModule } from './task-one/logger/logger.module';
import { AuditModule } from './task-two/audit/audit.module';
import { LifecycleModule } from './task-three/lifecycle.module';
import { TodoModule } from './task-4(todo)/todo.module';

@Module({
  imports: [MathModule, LoggerModule, AuditModule, LifecycleModule, TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
