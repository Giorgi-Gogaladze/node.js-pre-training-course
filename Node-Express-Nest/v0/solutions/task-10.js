// Express.js GET /todos/search endpoint with query params
// TODO: implement
const todos = [
    { id: 1, title: 'Buy milk', completed: false },
    { id: 2, title: 'Read book', completed: true },
    { id: 3, title: 'Learn NestJS', completed: false}
]

router.get('/todos/search', (req, res) => {
  const { completed } = req.query;

  if (completed !== undefined) {
    const isCompleted = completed === 'true';
    
    const filteredTodos = todos.filter(todo => todo.completed === isCompleted);
    return res.json(filteredTodos);
  }

  res.json(todos);
});

module.exports = router; 