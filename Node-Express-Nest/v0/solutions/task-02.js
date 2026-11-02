// Express.js app with POST /todos endpoint
const express = require('express');
const app = express();

// TODO: implement todos storage and POST /todos logic

app.use(express.json());

const todos = [
    {id: 1, title: 'sleep', completd: false},
]

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
    const {title} = req.body;

    if(!title){
        return res.status(400).json({error: 'title is required'})
    }

    const newTodo = {
        id: todos.length + 1,
        title: title,
        completed: false
    }

    todos.push(newTodo);

    res.status(201).json(newTodo)
})

module.exports = app; 