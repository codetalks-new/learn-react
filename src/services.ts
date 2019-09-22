import { Todo, makeTodo, makeBuiltinTags } from "./models";

const todos = [
  makeTodo({ name: "学习 React", tags: makeBuiltinTags({ important: true, urgent: true }) }),
  makeTodo({ name: "学习 TypeScript", tags: makeBuiltinTags({ important: true }) }),
  makeTodo({ name: "学习 CSS" })
];

const getIndexById = (id: string) => {
  return todos.findIndex(todo => todo.id === id);
};

export const loadTodos = () => {
  return new Promise<Todo[]>(resolve => {
    setTimeout(() => {
      resolve(todos);
    }, 1000);
  });
};

export const addTodo = (todo: Todo) => {
  return new Promise<Todo[]>(resove => {
    setTimeout(() => {
      todos.push(todo);
      resove(todos);
    });
  });
};

export const updateTodo = (todo: Todo) => {
  return new Promise<Todo[]>((resove, reject) => {
    setTimeout(() => {
      const index = getIndexById(todo.id);
      if (index != -1) {
        todos[index] = todo;
        resove(todos);
      } else {
        reject(new Error(`Todo(${todo.id}) ${todo.name} not found`));
      }
    });
  });
};
