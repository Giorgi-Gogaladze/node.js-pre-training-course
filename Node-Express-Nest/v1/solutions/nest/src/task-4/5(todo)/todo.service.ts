import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './interfaces/todo.interface';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';
import { TodoRepository } from './todo.repository';
import { TodoEntity } from './todo.entity';

@Injectable()
export class TodoService {
    constructor(private readonly repo: TodoRepository){}

    async findAll(completed?: boolean): Promise<TodoEntity[]> {
        const models = await this.repo.findAll(completed);
        return models.map(TodoEntity.fromModel);
    }

    async findOne(id: number): Promise<TodoEntity> {
        const model = await this.repo.findById(id);
        if(!model) throw new NotFoundException('todo not found');
        return TodoEntity.fromModel(model);
    }

    async create(dto: CreateTodoDto): Promise<TodoEntity> {
        return TodoEntity.fromModel(await this.repo.create(dto));
    }

    async update(id: number, dto: UpdateTodoDto): Promise<TodoEntity> {
        await this.findOne(id);
        return TodoEntity.fromModel(await this.repo.update(id, dto));
    }

    async remove(id: number): Promise<{ message: string }>{
        await this.findOne(id);
        await this.repo.delete(id);
        return { message: 'todo deleted successfully'}
    }
}
