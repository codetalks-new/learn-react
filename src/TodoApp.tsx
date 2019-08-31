import React, { Component, ChangeEvent } from "react";
import { Todo } from "./models";

const TodoHeader = () => {
  return (
    <caption>
      <h3>我的待办事项列表</h3>
    </caption>
  );
};

export interface TodoItemProps {
  todo: Todo;
  onRemove: () => void;
}

const _TodoItem = (props: TodoItemProps) => {
  const todo = props.todo;
  console.info(`Render TodoItem ${todo.name}`);
  return (
    <tr>
      <td>{todo.created}</td>
      <td>{todo.name}</td>
      <td>
        <button onClick={() => props.onRemove()}>删除</button>
      </td>
    </tr>
  );
};

const TodoItem = React.memo(_TodoItem);

export interface ToDoListProps {
  todos: Todo[];
  removeTodo: (index: number) => void;
}

export const TodoList = (props: ToDoListProps) => {
  const todos = props.todos.map((todo, index) => {
    return <TodoItem todo={todo} key={todo.name} onRemove={() => props.removeTodo(index)} />;
  });
  return <tbody>{todos}</tbody>;
};

interface TodoFormProps {
  handleSubmit: Function;
}

class TodoForm extends Component<TodoFormProps> {
  readonly state = {
    name: ""
  };

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  submitForm = () => {
    this.props.handleSubmit(this.state);
    this.setState({
      name: ""
    });
  };

  render() {
    const { name } = this.state;
    return (
      <form>
        <label>名称</label>
        <input type="text" name="name" value={name} onChange={this.handleChange} />
        <input type="button" value="提交" onClick={this.submitForm} />
      </form>
    );
  }
}

export class TodoApp extends Component {
  state = {
    todos: [
      { created: new Date().toLocaleString(), name: "学习 React" },
      { created: new Date().toLocaleString(), name: "学习 TypeScript" }
    ]
  };

  removeTodo = (index: number) => {
    const { todos } = this.state;
    this.setState({
      todos: todos.filter((_, i) => i !== index)
    });
  };

  handleSubmit = (data: { name: string }) => {
    const todo = { name: data.name, created: new Date().toLocaleString() };
    this.setState({
      todos: [...this.state.todos, todo]
    });
  };

  render() {
    const { todos } = this.state;
    return (
      <div>
        <table>
          <TodoHeader />
          <TodoList todos={todos} removeTodo={this.removeTodo} />
        </table>
        <TodoForm handleSubmit={this.handleSubmit} />
      </div>
    );
  }
}
