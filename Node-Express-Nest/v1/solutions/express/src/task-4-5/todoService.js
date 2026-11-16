const HttpError = require("../task-two/routes/HttpError");

let nextId = 1;
let todos = [];

function getAll(completed){
    if(completed === undefined) return todos;
    return todos.filter((t) => t.completed === completed);
}

function getById(id){
    const todo = todos.find((t) => t.id === id);

    if(!todo) throw new HttpError(404, 'todo not found');
    return todo;
}

function create({title, description ="", completed = false}){
    const now = new Date().toISOString();
    const todo = {
        id: nextId++,
        title: title.trim(),
        description,
        completed,
        createdAt: now, 
        updatedAt: now
    }

    todos.push(todo);
    return todo;
}

function updateTodo(id, changes){
    const todo = getById(id);

    if(changes.title !== undefined) todo.title = changes.title;
    if(changes.description !== undefined) todo.description = changes.description;
    if(changes.completed !== undefined) todo.completed = changes.completed;
    todo.updatedAt = new Date().toISOString();

    return todo
}

function remove(id){
    getById(id);
    todos = todos.filter((t) => t.id !== id);
}