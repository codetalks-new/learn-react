import { Todo, makeTodo, BuiltinTag } from "./models";
export const loadTodos = () => {
  return new Promise<Todo[]>(resolve => {
    setTimeout(() => {
      const todos = [
        makeTodo("学习 React", [BuiltinTag.IMPORTANT, BuiltinTag.URGENT]),
        makeTodo("学习 TypeScript", [BuiltinTag.IMPORTANT]),
        makeTodo("学习 CSS")
      ];
      resolve(todos);
    }, 1000);
  });
};
