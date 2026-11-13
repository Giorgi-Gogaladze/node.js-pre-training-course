import { Injectable } from "@nestjs/common";
import { LoggerService } from "src/task-one/logger/logger.service";

@Injectable()
export class MathService {
    constructor(private readonly logger: LoggerService) {}

    add(a: number, b: number): number{
        const result = a + b;
        this.logger.log("Mathservice", `add (): ${a} + ${b} = ${result}`);
        return result;
    }

    multiply(a: number, b: number): number{
        const result = a * b;
        this.logger.log("Mathservice", `mustiply (): ${a} * ${b} = ${result}`);
        return result;
    }
}
