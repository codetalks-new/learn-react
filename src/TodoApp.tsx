import React, { Component, ChangeEvent, FormEvent } from "react";
import "./TodoApp.css";

type StoreListener = () => void;

interface Action {
  type: string;
}

interface State {}

function createStore<S extends State, T extends Action>(reducer: (state: S, action: T) => S) {
  let state: S = {} as any;
  const listeners: StoreListener[] = [];
  const getState = () => {
    return state;
  };
  const subscribe = (listener: StoreListener) => {
    listeners.push(listener);
    const unsubscribe = () => {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
    return unsubscribe;
  };

  const dispatch = (action: T) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  dispatch({ type: "" } as T);
  return { dispatch, subscribe, getState };
}

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

enum TodoActionType {
  ADD = "ADD",
  EDIT = "EDIT",
  REMOVE = "REMOVE"
}

enum BuiltinTag {
  IMPORTANT = "重要",
  NOTIMPORTANT = "不重要",
  URGENT = "紧急",
  NOTURGENT = "不紧急"
}

const BUILTIN_TAGS = [BuiltinTag.IMPORTANT, BuiltinTag.NOTIMPORTANT, BuiltinTag.URGENT, BuiltinTag.NOTURGENT];

interface TodoAction extends Action {
  todo: Todo;
}

interface TodoState extends State {
  todos: Todo[];
}

const todoStore = createStore<TodoState, TodoAction>((state, action) => {
  if (!action.type) {
    const todos = [
      new Todo("学习 React", [BuiltinTag.IMPORTANT, BuiltinTag.URGENT]),
      new Todo("学习 TypeScript", [BuiltinTag.IMPORTANT]),
      new Todo("学习 CSS")
    ];
    return { ...state, todos };
  } else {
    const todos = state.todos.slice(); // 复制
    switch (action.type) {
      case TodoActionType.ADD:
        todos.push(action.todo);
        break;
      case TodoActionType.REMOVE:
        const index = todos.indexOf(action.todo);
        todos.splice(index, 1);
    }
    return { ...state, todos };
  }
});

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
    const todo = this.props.todo;
    if (tag) {
      todo.addTag(tag);
      todoStore.dispatch({ todo, type: TodoActionType.EDIT });
    }
    this.toggleTags();
  };
  removeTag = (tag: string) => {
    if (tag) {
      const todo = this.props.todo;
      todo.removeTag(tag);
      todoStore.dispatch({ todo, type: TodoActionType.EDIT });
    }
  };

  onRemove = () => {
    const todo = this.props.todo;
    todoStore.dispatch({ todo, type: TodoActionType.REMOVE });
  };

  render() {
    const todo = this.props.todo;
    const phase = todo.phases[todo.phases.length - 1];
    console.info(`Render TodoItem ${todo.name}`);
    const options = [<option value="">---</option>];
    for (const tag of BUILTIN_TAGS) {
      options.push(
        <option value={tag} key={tag}>
          {tag}
        </option>
      );
    }
    const tags = [];
    for (const tag of Array.from(todo.tags)) {
      tags.push(
        <span className="todo-tag" key={tag}>
          {tag}
          <button className="tag-remove-button" onClick={() => this.removeTag(tag)}>
            -
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
              +
            </button>
          )}
        </td>
        <td className="todo-status">{phase.status}</td>
        <td className="todo-actions">
          <button onClick={this.onRemove}>删除</button>
        </td>
      </tr>
    );
  }
}

export interface ToDoListProps {
  todos: Todo[];
}

export const TodoList = (props: ToDoListProps) => {
  const todos = props.todos.map((todo, index) => {
    return <TodoItem todo={todo} key={todo.name} />;
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
      <form onSubmit={this.submitForm}>
        <label>名称</label>
        <input type="text" name="name" value={name} onChange={this.handleChange} />
        <input type="button" value="提交" onClick={this.submitForm} />
      </form>
    );
  }
}

export class TodoApp extends Component {
  private unsubscribe: (() => void) | undefined;
  componentDidMount() {
    this.unsubscribe = todoStore.subscribe(() => {
      this.setState(todoStore.getState());
    });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  handleSubmit = (data: { name: string }) => {
    const todo = new Todo(data.name);
    todoStore.dispatch({ todo, type: TodoActionType.ADD });
  };

  render() {
    const { todos } = todoStore.getState();
    return (
      <div>
        <table>
          <TodoHeader />
          <TodoList todos={todos} />
        </table>
        <TodoForm handleSubmit={this.handleSubmit} />
      </div>
    );
  }
}
