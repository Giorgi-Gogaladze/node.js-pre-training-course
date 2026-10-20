import { Todo, NewTodo } from './types';
import { createTodo } from './todo-factory';
import { InMemoryRepository } from './repository';

export class TodoApi {
  // Task 6 stores todos in a plain array; Task 7 replaces it with InMemoryRepository
  constructor(
    private readonly repo = new InMemoryRepository<Todo>()){}

  async getAll(): Promise<Todo[]> {
    await delay();
    return this.repo.findAll();
  }


  async add(
    newTodo: NewTodo
  ): Promise<Todo> {
    await delay();
    const todo = createTodo(newTodo);

    return this.repo.add(todo);
  }

  

  async update(
    id: number, 
    update: Partial<Omit<Todo, 'id' | 'createdAt'>>
  ): Promise<Todo> {
    await delay();
    
    if (!this.repo.findById(id)) {
      throw new TodoNotFoundError(id);
    }
    return this.repo.update(id, update);
  }


  async remove(id: number): Promise<void> {
    await delay();
    if(!this.repo.findById(id)){
      throw new TodoNotFoundError(id);
    }
    this.repo.remove(id);
  }

}

function delay(): Promise<void>{
  const ms = 300 + Math.floor(Math.random() * 301);
  return new Promise((resolve) => setTimeout(resolve,ms));
}

export class TodoNotFoundError extends Error {
  constructor(public readonly id: number){
    super(`todo with id: ${id} not found`);
    this.name = 'TodoNotFoundError'
  }
}