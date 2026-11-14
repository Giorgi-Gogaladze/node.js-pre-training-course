import {Todo as PrismaTodo} from "@prisma/client"

export class TodoEntity {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;


static fromModel(model: PrismaTodo): TodoEntity {
        const entity = new TodoEntity();
        entity.id = model.id;
        entity.title = model.title;
        entity.description = model.description;
        entity.completed = model.completed;
        entity.createdAt = model.createdAt.toISOString();
        entity.updatedAt = model.updatedAt.toISOString();
        return entity;
    }
}
