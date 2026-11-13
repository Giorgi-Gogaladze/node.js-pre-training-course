import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { MathService } from "./math.service";
import { LoggerService } from "../logger/logger.service";


@Controller("math")
export class MathController {
    constructor(
        private readonly mathService: MathService,
        private readonly logger: LoggerService,
    ) {}

    @Get("add")
    add(@Query('a') a: string, @Query('b') b: string){
        this.logger.log("mathcontroller",   `GET /math/add a=${a}, b=${b}`);
        const {x, y} = this.parse(a, b);
        return {operation: "add", result: this.mathService.add(x, y)};
    }

    @Get("multiply")
    multiply(@Query('a') a: string, @Query('b') b: string){
        this.logger.log("mathcontroller",   `GET /math/multiply a=${a}, b=${b}`);
        const {x, y} = this.parse(a, b);
        return {operation: "multiply", result: this.mathService.multiply(x, y)};
    }


    private parse(a: string, b: string){
        const x = Number(a);
        const y = Number(b);
        if(a === undefined || b === undefined || Number.isNaN(x) || Number.isNaN(y)){
            throw new BadRequestException('query params a and b  must be a numbers')
        }
        return {x, y};
    }
}