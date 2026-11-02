// Express.js app with GET /todos/:id endpoint
const express = require('express');
const app = express();

// TODO: implement todos storage and GET /todos/:id logic
const todos = [
    {id: 1, title: "read books", completed: false},
    {id: 2, title: "sleep", completed: true}
];

app.get('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const todo = todos.filter(t => t.id === todoId);

    if(!todo){
        return res.status(404).json(error, 'todo not ofuund');
    }

    res.json(todo);
})

module.exports = app; 