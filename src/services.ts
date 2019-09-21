import { Todo, makeTodo, BuiltinTag, makeBuiltinTags } from "./models";
export const loadTodos = () => {
  return new Promise<Todo[]>(resolve => {
    setTimeout(() => {
      const todos = [
        makeTodo({ name: "学习 React", tags: makeBuiltinTags({ important: true, urgent: true }) }),
        makeTodo({ name: "学习 TypeScript", tags: makeBuiltinTags({ important: true }) }),
        makeTodo({ name: "学习 CSS" })
      ];
      resolve(todos);
    }, 1000);
  });
};
