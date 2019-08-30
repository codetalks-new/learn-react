import React, { Component } from "react";
import { Todo } from "./models";

export default class ClassBasedComp extends Component {
  render() {
    return <div className="ClassBasedComp">I'm A Class Based Components</div>;
  }
}

const TodoHeader = () => {
  return (
    <caption>
      <h3>我的待办事项列表</h3>
    </caption>
  );
};

export interface TodoItemProps {
  todo: Todo;
  index: number;
  removeTodo: (index: number) => void;
}

let TodoItem = (props: TodoItemProps) => {
  const todo = props.todo;
  console.info(`Render TodoItem ${todo.name}`);
  return (
    <tr>
      <td>{todo.created}</td>
      <td>{todo.name}</td>
      <td>
        <button onClick={() => props.removeTodo(props.index)}>删除</button>
      </td>
    </tr>
  );
};

export interface ToDoListProps {
  todos: Todo[];
  removeTodo: (index: number) => void;
}

export const TodoList = (props: ToDoListProps) => {
  const todos = props.todos.map((todo, index) => {
    return <TodoItem todo={todo} key={index} index={index} removeTodo={props.removeTodo} />;
  });
  return <tbody>{todos}</tbody>;
};

export class TodoTable extends Component {
  state = {
    todos: [
      { created: new Date().toLocaleString(), name: "学习 React" },
      { created: new Date().toLocaleString(), name: "学习 TypeScript" }
    ]
  };

  removeTodo = (index: number) => {
    const { todos } = this.state;
    this.setState({
      todos: todos.filter((_, i) => i != index)
    });
  };

  render() {
    const { todos } = this.state;
    return (
      <table>
        <TodoHeader />
        <TodoList todos={todos} removeTodo={this.removeTodo} />
      </table>
    );
  }
}
