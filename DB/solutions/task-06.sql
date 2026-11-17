create INDEX idx_todos_status on todos (status);

EXPLAIN ANALYZE
SELECT * FROM todos WHERE status = 'completed';
