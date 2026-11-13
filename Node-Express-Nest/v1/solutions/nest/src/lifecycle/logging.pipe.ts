import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class LoggingPipe implements PipeTransform{
    transform(value: string, metadata: ArgumentMetadata):  number {
        console.log(`PIPE: transforming ${value} (${metadata.type})`);

        const num = Number(value);
        if(Number.isNaN(num)){
            throw new BadRequestException(`"${value}" is not a number`);
        }
        return num;
    }
}