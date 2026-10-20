import { Todo, NewTodo, TodoStatus } from './types';
import { createTodo } from './todo-factory';

export class TodoApi {
  // Task 6 stores todos in a plain array; Task 7 replaces it with InMemoryRepository
  private todos: Todo[] = [];

  async getAll(): Promise<Todo[]> {
    await delay();

    if(this.todos == null)throw new Error('todos state is not initialized');
    return [...this.todos];
  }


  async add(
    newTodo: NewTodo
  ): Promise<Todo> {
    await delay();

    const exists = this.todos.some(item => item.title = newTodo.title);
    if(exists){
      throw new Error('todo with the same title already exist');
    };

    const todo = createTodo(newTodo);
    this.todos.push(todo);
    return todo;
  }

  

  async update(
    id: number, 
    update: Partial<Omit<Todo, 'id' | 'createdAt'>>
  ): Promise<Todo> {
    await delay();
    const index = this.todos.findIndex((t) => t.id === id );

    if(index === -1){
      throw new TodoNotFoundError(id);
    };

    const updated: Todo = {...this.todos[index], ...update};
    
    this.todos[index] = updated;
    return updated;
  }


  async remove(id: number): Promise<void> {
    await delay();
    const index = this.todos.findIndex((t) => t.id === id);

    if(index === -1){
      throw new TodoNotFoundError(id);
    }

    this.todos.splice(index, 1);
    
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