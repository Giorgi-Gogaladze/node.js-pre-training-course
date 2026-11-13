import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MathModule } from './task-one/math/math.module';
import { LoggerModule } from './task-one/logger/logger.module';

@Module({
  imports: [MathModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
