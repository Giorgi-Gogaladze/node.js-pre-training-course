// NestJS Controller for /todos
import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { TodosService } from './task-06';
import { ToDoDto } from './task-09';

@Controller('todos')
export class TodosController {

  constructor(private readonly todoService: TodosService){}

  @Get()
  getTodos() {
    return this.todoService.getTodos();
  }
  
  @Post()
  createTodo(@Body() todoDto: ToDoDto){
    return this.todoService.addTodo(todoDto.title);
  }

  @Patch(':id/complete')
  completeTodo(@Body('id') id: number){
    return this.todoService.markCompleted(id);
  }
}

