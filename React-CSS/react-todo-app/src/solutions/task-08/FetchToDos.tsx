import React, { useState, useEffect } from 'react';
import { Todo } from '../../types';

export const FetchToDos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] =  useState<string | null>(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const formattedTodos: Todo[] = data.slice(0, 5).map((item: any) => ({
          id: item.id,
          title: item.title,
          completed: item.completed,
        }));
        
        setTodos(formattedTodos);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);


  if(loading){
    return <p>Loading todos...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <div>
      <h4>Fetch ToDos Component</h4>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <strong>{todo.title}</strong> — {todo.completed ? '✅ Completed' : '⏳ Pending'}
          </li>
        ))}
      </ul>
    </div>
  );
}; 