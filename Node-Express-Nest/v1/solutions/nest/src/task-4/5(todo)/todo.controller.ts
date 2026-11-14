import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dtos/create-todo.dto';
import { UpdateTodoDto } from './dtos/update-todo.dto';

@Controller('todo')
export class TodoController {
    constructor(private readonly todoService: TodoService){}

    @Get()
    async findAll(@Query('completed') completed?: string){
        let filter: boolean | undefined;
        if(completed !== undefined){
            if(completed !== "true" && completed !== "false"){
                throw new BadRequestException('"completed" must be true or false');
            }
            filter = completed === "true";
        };
        const data = await this.todoService.findAll(filter);
        return {success: true, data, count: data.length};
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return { success: true, data: await this.todoService.findOne(id) };
    }

    @Post()
    async create(@Body() dto: CreateTodoDto) {
        return { success: true, data: await this.todoService.create(dto) };
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTodoDto) {
        return { success: true, data:await this.todoService.update(id, dto) };
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return { success: true, ...(await this.todoService.remove(id)) };
    }
}
