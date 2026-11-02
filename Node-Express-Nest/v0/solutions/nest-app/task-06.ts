// NestJS Service for ToDos
import { Injectable } from '@nestjs/common';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable()
export class TodosService {
  // TODO: implement todos storage and methods (getTodos, addTodo, markCompleted)
private todos: Todo[] = [
  { id: 1, title: 'sleep', completed: false },
  { id: 2, title: 'read books', completed: false }
];

  getTodos(): Todo[] {
    return this.todos;
  }

  addTodo(title: string): Todo {
    const newTodo: Todo = {
      id: this.todos.length + 1,
      title,
      completed: false
    };

    this.todos.push(newTodo);
    return newTodo;
  };

  markCompleted(id: number): Todo | null {
    const todo = this.todos.find(t => t.id === id);
    if(todo){
      todo.completed = true;
      return todo;
    }
    return null;
  }
} 