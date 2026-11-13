import { Module } from "@nestjs/common";
import { MathService } from "./math.service";
import { LoggerModule } from "src/task-one/logger/logger.module";
import { MathController } from "./math.controller";

@Module({
    providers: [MathService],
    exports: [MathService],
    imports: [LoggerModule],
    controllers:[MathController]
 })

export class MathModule {}