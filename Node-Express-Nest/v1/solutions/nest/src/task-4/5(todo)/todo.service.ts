import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';
import { TodoRepository } from './todo.repository';
import { TodoEntity } from './todo.entity';
import { CACHE_MANAGER, type Cache } from '@nestjs/cache-manager';

@Injectable()
export class TodoService {
    constructor(
        private readonly repo: TodoRepository,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    ){}

    async findAll(completed?: boolean): Promise<TodoEntity[]> {
        const cacheKey = `todos:list:${completed ?? 'all'}`;

        const cachedData = await this.cacheManager.get<TodoEntity[]>(cacheKey);
        if(cachedData){
            return cachedData;
        }

        const models = await this.repo.findAll(completed);
        const entities =  models.map(TodoEntity.fromModel);

        await this.cacheManager.set(cacheKey, entities, 300000);

        return entities;

    }

    async findOne(id: number): Promise<TodoEntity> {
        const cacheKey = `todo:${id}`;

        const cached = await this.cacheManager.get<TodoEntity>(cacheKey);
        if(cached) return cached;

        const model = await this.repo.findById(id);
        if(!model) throw new NotFoundException('todo not found');

        const entity =  TodoEntity.fromModel(model);
        await this.cacheManager.set(cacheKey, entity, 300000);

        return entity;
    }

    async create(dto: CreateTodoDto): Promise<TodoEntity> {
        const newModel = await this.repo.create(dto);

        await this.clearTodoCaches();
        return TodoEntity.fromModel(newModel);
    }

    async update(id: number, dto: UpdateTodoDto): Promise<TodoEntity> {
        await this.findOne(id);

        const updateModel = await this.repo.update(id, dto);
        await this.cacheManager.del(`todo:${id}`);
        await this.clearTodoCaches();

        return TodoEntity.fromModel(updateModel);
    }

    async remove(id: number): Promise<{ message: string }>{
        await this.findOne(id);
        await this.repo.delete(id);

        await this.cacheManager.del(`todo:${id}`);
        await this.clearTodoCaches();
        return { message: 'todo deleted successfully'}
    }

    private async clearTodoCaches() {
        await this.cacheManager.mdel([
            'todos:list:all',
            'todos:list:true',
            'todos:list:false',
        ]);
    }
}
