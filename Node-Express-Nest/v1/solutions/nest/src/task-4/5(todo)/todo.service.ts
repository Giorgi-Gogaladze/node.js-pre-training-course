import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './interfaces/todo.interface';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';

@Injectable()
export class TodoService {
    private todos: Todo[] = [];
    private nextId = 1;

    findAll(completed?: boolean): Todo[]{
        if(completed === undefined) return this.todos;
        return this.todos.filter((t) => t.completed === completed);
    }

    findOne(id: number): Todo {
        const todo = this.todos.find((t) => t.id === id);
        if(!todo){
            throw new NotFoundException(`Todo with id ${id} not found`);
        }
        return todo;
    }

    create(dto: CreateTodoDto): Todo {
        const now = new Date();
        const todo: Todo = {
            id: this.nextId++,
            title: dto.title.trim(),
            description: dto.description ?? '',
            completed: dto.completed ?? false,
            createdAt: now,
            updatedAt: now,
        };
        this.todos.push(todo);
        return todo;
    }

    update(id: number, dto: UpdateTodoDto): Todo {
        const todo = this.findOne(id);

        if(dto.title !== undefined) todo.title = dto.title.trim();
        if(dto.description !== undefined) todo.description = dto.description;
        if(dto.completed !== undefined) todo.completed = dto.completed;
        todo.updatedAt = new Date();

        return todo;
    }

    remove(id: number): {message: string}{
        const todo = this.findOne(id);
        this.todos = this.todos.filter((t) => t.id !== todo.id);
        return {message: "todo removed successfully"}
    }
}
