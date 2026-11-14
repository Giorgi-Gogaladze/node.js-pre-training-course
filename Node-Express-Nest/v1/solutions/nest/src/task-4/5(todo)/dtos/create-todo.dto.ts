import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateTodoDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    title: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;

    @IsOptional()
    @IsBoolean()
    completed?: boolean;
}