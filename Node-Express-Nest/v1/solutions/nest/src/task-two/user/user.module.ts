import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  providers: [UserService],
  exports: [UserService],
  imports: [LoggerModule]
})
export class UserModule {}
