import { TodoService } from '../JS-TS/solutions/todo-service';
import { TodoApi, TodoNotFoundError } from '../JS-TS/solutions/todo-api';
import { TodoStatus } from '../JS-TS/solutions/types';
import { InMemoryRepository } from '../JS-TS/solutions/repository';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    jest.useFakeTimers();
    service = new TodoService(new TodoApi());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  async function createTodo(title: string, description?: string) {
    const promise = service.create(title, description);
    await jest.runAllTimersAsync();
    return promise;
  }

  describe('create', () => {
    it('creates a todo with trimmed title, description and PENDING status', async () => {
      const todo = await createTodo('  Learn Jest  ', 'desc');

      expect(todo.title).toBe('Learn Jest');
      expect(todo.description).toBe('desc');
      expect(todo.status).toBe(TodoStatus.PENDING);
      expect(todo.createdAt).toBeInstanceOf(Date);
    });

    it('creates a todo without description', async () => {
      const todo = await createTodo('Only title');

      expect(todo.description).toBeUndefined();
    });

    it.each([
      ['empty string', ''],
      ['only spaces', '   '],
      ['tabs and newlines', '\t\n'],
    ])('rejects invalid title: %s', async (_label, badTitle) => {
      await expect(service.create(badTitle)).rejects.toThrow('Title cant be an empty space');
    });

    it('rejects when title is undefined/null at runtime', async () => {
      await expect(service.create(undefined as unknown as string)).rejects.toThrow(
        'Title cant be an empty space'
      );
    });

    it('does not save anything when validation fails', async () => {
      await expect(service.create('   ')).rejects.toThrow();

      const promise = service.search('');
      await jest.runAllTimersAsync();
      expect(await promise).toEqual([]);
    });
  });

  describe('toggleStatus', () => {
    it('cycles PENDING → IN_PROGRESS → COMPLETED → PENDING', async () => {
      const todo = await createTodo('Cycle me');
      expect(todo.status).toBe(TodoStatus.PENDING);

      let promise = service.toggleStatus(todo.id);
      await jest.runAllTimersAsync();
      expect((await promise).status).toBe(TodoStatus.IN_PROGRESS);

      promise = service.toggleStatus(todo.id);
      await jest.runAllTimersAsync();
      expect((await promise).status).toBe(TodoStatus.COMPLETED);

      promise = service.toggleStatus(todo.id);
      await jest.runAllTimersAsync();
      expect((await promise).status).toBe(TodoStatus.PENDING);
    });

    it('throws TodoNotFoundError when the todo does not exist', async () => {
      const assertion = expect(service.toggleStatus(99999)).rejects.toBeInstanceOf(
        TodoNotFoundError
      );
      await jest.runAllTimersAsync();
      await assertion;
    });
  });

  describe('setStatus', () => {
    it('sets the given status', async () => {
      const todo = await createTodo('Set me');

      const promise = service.setStatus(todo.id, TodoStatus.COMPLETED);
      await jest.runAllTimersAsync();
      const updated = await promise;

      expect(updated.status).toBe(TodoStatus.COMPLETED);
      expect(updated.id).toBe(todo.id);
      expect(updated.title).toBe('Set me');
    });

    it('throws TodoNotFoundError when id does not exist', async () => {
      const assertion = expect(
        service.setStatus(99999, TodoStatus.COMPLETED)
      ).rejects.toBeInstanceOf(TodoNotFoundError);
      await jest.runAllTimersAsync();
      await assertion;
    });

    it('error carries the missing id', async () => {
      const caught = service.setStatus(12345, TodoStatus.COMPLETED).catch((e) => e);
      await jest.runAllTimersAsync();
      const error = await caught;

      expect(error).toBeInstanceOf(TodoNotFoundError);
      expect(error.id).toBe(12345);
      expect(error.name).toBe('TodoNotFoundError');
    });
  });

  describe('search', () => {
    async function search(keyword: string) {
      const promise = service.search(keyword);
      await jest.runAllTimersAsync();
      return promise;
    }

    it('returns items matching by title', async () => {
      await createTodo('Buy milk');
      await createTodo('Walk the dog');

      const result = await search('milk');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Buy milk');
    });

    it('returns items matching by description', async () => {
      await createTodo('Study', 'Read the HANDBOOK');
      await createTodo('Other', 'nothing here');

      const result = await search('handbook');

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Study');
    });

    it('is case-insensitive', async () => {
      await createTodo('Learn TypeScript');

      expect(await search('typescript')).toHaveLength(1);
      expect(await search('TYPESCRIPT')).toHaveLength(1);
    });

    it('returns an empty array when nothing matches', async () => {
      await createTodo('Something');

      expect(await search('zzz-no-match')).toEqual([]);
    });

    it('handles todos without description', async () => {
      await createTodo('No description here');

      expect(await search('description')).toHaveLength(1);
      expect(await search('missing')).toEqual([]);
    });
  });
});

describe('InMemoryRepository', () => {
  interface Item {
    id: number;
    name: string;
  }

  let repo: InMemoryRepository<Item>;

  beforeEach(() => {
    repo = new InMemoryRepository<Item>();
  });

  it('adds an entity and returns it', () => {
    const item = { id: 1, name: 'A' };

    expect(repo.add(item)).toBe(item);
    expect(repo.findAll()).toEqual([item]);
  });

  it('findById returns the entity when it exists', () => {
    repo.add({ id: 1, name: 'A' });

    expect(repo.findById(1)).toEqual({ id: 1, name: 'A' });
  });

  it('findById returns undefined when it does not exist', () => {
    expect(repo.findById(999)).toBeUndefined();
  });

  it('findAll returns a copy, not the internal array', () => {
    repo.add({ id: 1, name: 'A' });

    const all = repo.findAll();
    all.push({ id: 2, name: 'B' }); 

    expect(repo.findAll()).toHaveLength(1);
  });

  it('update merges the patch into the existing entity', () => {
    repo.add({ id: 1, name: 'A' });

    const updated = repo.update(1, { name: 'B' });

    expect(updated).toEqual({ id: 1, name: 'B' });
    expect(repo.findById(1)).toEqual({ id: 1, name: 'B' });
  });

  it('update throws a plain Error when the entity does not exist', () => {
    expect(() => repo.update(999, { name: 'X' })).toThrow('entity with id: 999 not found');
  });

  it('remove deletes the entity', () => {
    repo.add({ id: 1, name: 'A' });
    repo.add({ id: 2, name: 'B' });

    repo.remove(1);

    expect(repo.findById(1)).toBeUndefined();
    expect(repo.findAll()).toEqual([{ id: 2, name: 'B' }]); 
  });

  it('remove throws a plain Error when the entity does not exist', () => {
    expect(() => repo.remove(999)).toThrow('entity with id: 999 not found');
  });
});