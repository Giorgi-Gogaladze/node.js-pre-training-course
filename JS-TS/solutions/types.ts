interface Todo {
    id: number;
    title: string;
    description?: string;
    status: TodoStatus;
    createdAt: Date;
}

enum TodoStatus {
    PENDING='PENDING',
    COMPLETED='COMPLETED',
    IN_PROGRESS='IN_PROGRESS'
}

type NewTodo = Omit<Todo, 'id' | 'createdAt' | 'status'>;

export { Todo, TodoStatus, NewTodo };