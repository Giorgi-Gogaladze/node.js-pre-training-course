// NestJS Controller for /todos
import { Body, Controller, Get, Post } from '@nestjs/common';
import { TodosService } from './task-06';

@Controller('todos')
export class TodosController {

  constructor(private readonly todoService: TodosService){}

  @Get()
  getTodos() {
    return this.todoService.getTodos();
  }
  
  @Post()
  createTodo(@Body('title') title: string){
    return this.todoService.addTodo(title)
  }
}