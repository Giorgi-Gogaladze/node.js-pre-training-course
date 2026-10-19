import { Todo, NewTodo, TodoStatus } from './types';

let nextId = 1;

export function createTodo(input: NewTodo): Todo {
  if(input == null)throw new Error('createTodo: not implemented');

  const newTodo: Todo = {
    id: nextId++,
    ...input,
    status:TodoStatus.PENDING,
    createdAt:  new Date()
  }
  return newTodo;
}
