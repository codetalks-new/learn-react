import React, { Component, ChangeEvent, FormEvent } from "react";
import "./TodoApp.css";

enum BuiltinTag {
  IMPORTANT = "重要",
  NOTIMPORTANT = "不重要",
  URGENT = "紧急",
  NOTURGENT = "不紧急"
}

const BUILTIN_TAGS = [BuiltinTag.IMPORTANT, BuiltinTag.NOTIMPORTANT, BuiltinTag.URGENT, BuiltinTag.NOTURGENT];

enum Status {
  CREATED = "创建",
  pending = "准备处理",
  DOING = "进入中",
  PAUSE = "暂停处理",
  FINISHED = "已完成",
  CANCELED = "已取消",
  DELETED = "已删除"
}

class Phase {
  from: Date;
  to?: Date;
  status: Status;
  constructor(status: Status) {
    this.status = status;
    this.from = new Date();
  }
}

class Todo {
  name: string;
  tags: Set<string>;
  created: Date;
  phases: Phase[] = [];
  finished?: Date;
  constructor(name: string, tags: string[] = []) {
    this.name = name;
    this.created = new Date();
    this.tags = new Set(tags);
    this.phases.push(new Phase(Status.CREATED));
  }

  markFinished() {
    this.finished = new Date();
  }
  addTag(tag: string) {
    this.tags.add(tag);
  }
  removeTag(tag: string) {
    this.tags.delete(tag);
  }
}

const TodoHeader = () => {
  return (
    <thead>
      <tr className="todo-list-header">
        <td>创建时间</td>
        <td>名称</td>
        <td>标签</td>
        <td>状态</td>
        <td>操作</td>
      </tr>
    </thead>
  );
};

export interface TodoItemProps {
  todo: Todo;
  onRemove: () => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

class TodoItem extends Component<TodoItemProps> {
  state = {
    showTagSelect: false
  };
  toggleTags = () => {
    this.setState({
      showTagSelect: !this.state.showTagSelect
    });
  };
  onSelectTag = (e: ChangeEvent<HTMLSelectElement>) => {
    const tag = e.target.value;
    if (tag) {
      this.props.onAddTag(tag);
    }
    this.toggleTags();
  };
  render() {
    const todo = this.props.todo;
    const phase = todo.phases[todo.phases.length - 1];
    console.info(`Render TodoItem ${todo.name}`);
    const options = [<option value="">---</option>];
    for (const tag of BUILTIN_TAGS) {
      options.push(<option value={tag}>{tag}</option>);
    }
    const tags = [];
    for (const tag of Array.from(todo.tags)) {
      tags.push(
        <span className="todo-tag">
          {tag}
          <button className="tag-remove-button" onClick={() => this.props.onRemoveTag(tag)}>
            X
          </button>
        </span>
      );
    }
    return (
      <tr className="todo">
        <td className="todo-created">{todo.created.toISOString()}</td>
        <td className="todo-name">{todo.name}</td>
        <td className="todo-tags">
          {tags}
          {this.state.showTagSelect ? (
            <label>
              选择标签:<select onChange={this.onSelectTag}>{options}</select>
            </label>
          ) : (
            <button onClick={this.toggleTags} className="tag-add-button">
              ＋
            </button>
          )}
        </td>
        <td className="todo-status">{phase.status}</td>
        <td className="todo-actions">
          <button onClick={this.props.onRemove}>删除</button>
        </td>
      </tr>
    );
  }
}

export interface ToDoListProps {
  todos: Todo[];
  removeTodo: (index: number) => void;
  addTag: (index: number, tag: string) => void;
  removeTag: (index: number, tag: string) => void;
}

export const TodoList = (props: ToDoListProps) => {
  const todos = props.todos.map((todo, index) => {
    return (
      <TodoItem
        todo={todo}
        key={todo.name}
        onAddTag={tag => props.addTag(index, tag)}
        onRemoveTag={tag => props.removeTag(index, tag)}
        onRemove={() => props.removeTodo(index)}
      />
    );
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

  submitForm = (e: FormEvent) => {
    e.preventDefault();
    this.props.handleSubmit(this.state);
    this.setState({
      name: ""
    });
  };

  render() {
    const { name } = this.state;
    return (
      <form onSubmit={this.submitForm} style={{ marginTop: "8px" }}>
        <label>事项名称:</label>
        <input type="text" name="name" value={name} onChange={this.handleChange} autoComplete="off" />
        <input type="button" value="添加" onClick={this.submitForm} style={{ marginLeft: "8px" }} />
      </form>
    );
  }
}

export class TodoApp extends Component {
  state = {
    todos: [
      new Todo("学习 React", [BuiltinTag.IMPORTANT, BuiltinTag.URGENT]),
      new Todo("学习 TypeScript", [BuiltinTag.IMPORTANT]),
      new Todo("学习 CSS")
    ]
  };

  removeTodo = (index: number) => {
    const { todos } = this.state;
    this.setState({
      todos: todos.filter((_, i) => i !== index)
    });
  };

  addTag = (index: number, tag: string) => {
    const todos = this.state.todos;
    const todo = todos[index];
    todo.addTag(tag);
    this.setState({
      todos
    });
  };
  removeTag = (index: number, tag: string) => {
    const todos = this.state.todos;
    const todo = todos[index];
    todo.removeTag(tag);
    this.setState({
      todos
    });
  };
  handleSubmit = (data: { name: string }) => {
    const todo = new Todo(data.name);
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
          <TodoList todos={todos} addTag={this.addTag} removeTag={this.removeTag} removeTodo={this.removeTodo} />
        </table>
        <TodoForm handleSubmit={this.handleSubmit} />
      </div>
    );
  }
}

/**
 *
 *
 * [React & TypeScript]  手把手教你写一个简单的 Redux - by 代码会说话
 *
 *
 *
 */
