import { TodoApi, TodoNotFoundError } from './todo-api';
import { Todo, TodoStatus } from './types';

export const NEXT_STATUS: Record<TodoStatus, TodoStatus> = {
  [TodoStatus.PENDING]: TodoStatus.IN_PROGRESS,
  [TodoStatus.IN_PROGRESS]: TodoStatus.COMPLETED, 
  [TodoStatus.COMPLETED]: TodoStatus.PENDING
}


export class TodoService {
  constructor(private readonly api: TodoApi) { }

  async create(
    title: string, 
    description?: string
  ): Promise<Todo> {
      if(!title || title.trim() === ''){
        throw new Error('Title cant be an empty space')
      };

    return this.api.add({title: (title as string).trim(), description: description});
  }


  async toggleStatus(
    id: number
  ): Promise<Todo> {
    const todos =await this.api.getAll();
    const todo = todos.find((t) => t.id === id);
    if(!todo){
      throw new TodoNotFoundError(id);
    };

    return this.api.update(id, {status: NEXT_STATUS[todo.status]})
  }

  async setStatus(
    id: number, 
    status: TodoStatus
  ): Promise<Todo> {
    return this.api.update(id, {status})
  }

  async search(
    keyword: string
  ): Promise<Todo[]> {
    const kWord = keyword.toLowerCase();
    const todos = await this.api.getAll();
    return todos.filter((t) => 
      t.title.toLowerCase().includes(kWord) || (t.description ?? '').toLowerCase().includes(kWord));
  }
}
