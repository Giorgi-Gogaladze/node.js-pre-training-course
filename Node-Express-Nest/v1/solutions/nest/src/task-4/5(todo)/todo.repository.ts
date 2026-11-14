import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Todo as PrismaTodo } from "@prisma/client";
import { CreateTodoDto } from "./dtos/create-todo.dto";
import { UpdateTodoDto } from "./dtos/update-todo.dto";

@Injectable()
export class TodoRepository {
    constructor (private readonly prisma: PrismaService){}

    findAll(completed?: boolean){
        return this.prisma.todo.findMany({
            where: {completed},
            orderBy: {id: 'asc'}
        })
    }

    findById(id: number): Promise<PrismaTodo | null> {
        return this.prisma.todo.findUnique({where: {id}});
    }

    create(dto: CreateTodoDto): Promise<PrismaTodo> {
        return this.prisma.todo.create({
            data: {
                title: dto.title.trim(),
                description: dto.description ?? "",
                completed: dto.completed ?? false
            }
        })
    }
    
    update(id: number, dto: UpdateTodoDto): Promise<PrismaTodo> {
        return this.prisma.todo.update({
            where: { id },
            data: {
                title: dto.title?.trim(),
                description: dto.description,
                completed: dto.completed,
            },
        });
    }

    delete(id: number): Promise<PrismaTodo> {
        return this.prisma.todo.delete({ where: {id}})
    }

}