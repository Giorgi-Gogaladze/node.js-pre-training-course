import { Todo, TodoStatus } from './types';

export function toggleAll(
  state: Todo[], 
  completed: boolean
): Todo[] {
  if(state == null)throw new Error('toggleAll: not implemented');

  return state.map(item => ({
    ...item, 
    status: completed ? TodoStatus.COMPLETED : TodoStatus.PENDING
  }))
}



export function clearCompleted(
  state: Todo[]
): Todo[] {
  if(state == null)throw new Error('clearCompleted: not implemented');

  return state.filter(item => item.status !== TodoStatus.COMPLETED)
}



export function countByStatus(
  state: Todo[], 
  status: TodoStatus
): number {
  if(state == null)throw new Error('countByStatus: not implemented');

  return state.reduce((acc, item) =>{
    if(item.status === status){
      return acc + 1;
    }
    return acc;
  }, 0)
}
