// Express.js app with GET /todos endpoint
const express = require('express');
const app = express();

// TODO: implement todos storage and GET /todos logic

const todos = [
  { id: 1, title: 'Buy milk', completed: false },
  { id: 2, title: 'Learn Express.js', completed: true }
];

app.get('/todos', (req, res) => {
    res.json(todos)
})

module.exports = app; 