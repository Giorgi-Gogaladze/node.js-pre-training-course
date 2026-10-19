import { Todo } from './types';

export function addTodo(
  state: Todo[], 
  todo: Todo
): Todo[] {
  if(state == null || todo == null) {
    throw new Error('state or todo cant be undefined');
  }
  return [...state, todo]
}



export function updateTodo(
  state: Todo[], 
  id: number, 
  update: Partial<Omit<Todo, 'id' | 'createdAt'>>
): Todo[] {
  if(state == null || update == null) throw new Error('updateTodo: not implemented');
  
  const exists = state.some(item => item.id === id);
  if(!exists) throw new Error(`todo item with an Id: ${id} not found`);

  return state.map(item => {
    if(item.id === id){
      return {
        ...item,
        ...update,
      }
    };
    return item;
  })
}



export function removeTodo(
  state: Todo[], 
  id: number
): Todo[] {
  if(state == null)throw new Error('removeTodo: not implemented');

  const exists = state.some(item => item.id === id);
  if(!exists){
    throw new Error(`state with id ${id} doesnt exist`)
  }

  return state.filter(item => item.id !== id);
}



export function getTodo(state: Todo[], id: number): Todo | undefined {
  if(state == null) throw new Error('getTodo: not implemented');
  const exists = state.some(item => item.id === id);
  if(!exists){
    throw new Error(`state with id ${id} doesnt exist`)
  }

  const todo = state.find(item => item.id === id);
  return todo;
}
