import React, { Component, ChangeEvent, FormEvent, Fragment } from "react";
import "./TodoApp.css";

interface Action {
  type: string; //操作类型
}

enum BuiltinTag {
  IMPORTANT = "重要",
  NOTIMPORTANT = "不重要",
  URGENT = "紧急",
  NOTURGENT = "不紧急"
}

const BUILTIN_TAGS = [
  BuiltinTag.IMPORTANT,
  BuiltinTag.NOTIMPORTANT,
  BuiltinTag.URGENT,
  BuiltinTag.NOTURGENT
];

enum Status {
  CREATED = "创建",
  DOING = "处理中",
  PAUSE = "暂停处理",
  FINISHED = "已完成",
  DELETED = "已删除"
}

interface Phase {
  from: Date;
  to?: Date;
  status: Status;
}
// redux 可序列化,不可变性

interface Todo {
  name: string;
  tags: string[];
  phases: Phase[];
}

const makeTodo = (name: string, tags: string[] = [], phases: Phase[] = []): Todo => {
  let phases_fallback = phases.length > 0 ? phases : [{ from: new Date(), status: Status.CREATED }];
  return {
    name,
    tags,
    phases: phases_fallback
  };
};

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

enum TodoActionType {
  ADD_TAG = "add_tag",
  REMOVE_TAG = "remove_tag",
  ADD = "add",
  REMOVE = "remove",
  UPDATE_STATUS = "update_status",
  FILTER_BY_STATUS = "filter_by_status"
}

type ActionCreator<T extends Action> = (payload: Omit<T, "type">) => T;
// payload
interface TodoObjectAction extends Action {
  type: TodoActionType.ADD | TodoActionType.REMOVE;
  todo: Todo;
}

type TodoObjectActionCreator = ActionCreator<TodoObjectAction>;

interface TagAction extends Action {
  type: TodoActionType.ADD_TAG | TodoActionType.REMOVE_TAG;
  todo: Todo;
  tag: string;
}
type TagActionCreator = ActionCreator<TagAction>;

interface UpdateStatusAction extends Action {
  type: TodoActionType.UPDATE_STATUS;
  todo: Todo;
  targetStatus: Status;
}
type UpdateStatusActionCreator = ActionCreator<UpdateStatusAction>;

interface FilterByStatusAction extends Action {
  type: TodoActionType.FILTER_BY_STATUS;
  filterStatus: Status | null | undefined;
}
type FilterByStatusActionCreator = ActionCreator<FilterByStatusAction>;

type TodoAction = TodoObjectAction | TagAction | UpdateStatusAction | FilterByStatusAction;

type StoreListener = () => void;
interface State {}

// redux

const __init_action_type = "INIT_STORE";
function createStore<T extends Action, S extends State>(reducer: (state: S, action: T) => S) {
  const listeners: StoreListener[] = [];
  let state: S = {} as any;
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
    // midllware
    listeners.forEach(listener => listener());
  };
  dispatch({ type: __init_action_type } as T);
  return { dispatch, subscribe, getState };
}

interface TodoAppState extends State {
  todos: Todo[];
  filterStatus: Status | null | undefined;
}

const todoObjectReducer = (state: TodoAppState, action: TodoObjectAction): TodoAppState => {
  const todos = state.todos.slice(); // 复制
  const todo = action.todo;
  switch (action.type) {
    case TodoActionType.ADD:
      todos.push(todo);
      break;
    case TodoActionType.REMOVE:
      {
        const index = todos.indexOf(todo);
        todos.splice(index, 1);
      }
      break;
  }
  return { ...state, todos };
};

const todoTagReducer = (state: TodoAppState, action: TagAction): TodoAppState => {
  const todos = state.todos.slice(); // 复制
  const todo = action.todo;
  switch (action.type) {
    case TodoActionType.ADD_TAG:
      {
        const index = todos.indexOf(todo);
        const tag_set = new Set(todo.tags);
        tag_set.add(action.tag);
        const tags = Array.from(tag_set);
        const newTodo = { ...todo, tags };
        todos[index] = newTodo;
      }
      break;
    case TodoActionType.REMOVE_TAG:
      {
        const index = todos.indexOf(todo);
        const tags = todo.tags.slice();
        const tagIndex = todo.tags.indexOf(action.tag);
        tags.splice(tagIndex, 1);
        console.info(`oldTags:${todo.tags}, newTags:${tags}`);
        const newTodo = { ...todo, tags };
        todos[index] = newTodo;
      }
      break;
  }
  return { ...state, todos };
};

const updateStatusReducer = (state: TodoAppState, action: UpdateStatusAction): TodoAppState => {
  const todos = state.todos.slice(); // 复制
  const todo = action.todo;
  const index = todos.indexOf(todo);
  const phases = todo.phases.slice();
  phases.push({ from: new Date(), status: action.targetStatus });
  const newTodo = { ...todo, phases };
  todos[index] = newTodo;
  return { ...state, todos };
};

const filterByStatusReducer = (state: TodoAppState, action: FilterByStatusAction): TodoAppState => {
  return { ...state, filterStatus: action.filterStatus };
};

const rootReducer = (state: TodoAppState, action: TodoAction) => {
  return {
    todos: [
      makeTodo("学习 React", [BuiltinTag.IMPORTANT, BuiltinTag.URGENT]),
      makeTodo("学习 TypeScript", [BuiltinTag.IMPORTANT]),
      makeTodo("学习 CSS")
    ],
    filterStatus: null
  };
};

const todoStore = createStore<TodoAction, TodoAppState>((state, action) => {
  if ((action.type as string) === __init_action_type) {
    return rootReducer(state, action);
  }
  switch (action.type) {
    case TodoActionType.ADD:
    case TodoActionType.REMOVE:
      return todoObjectReducer(state, action);
    case TodoActionType.ADD_TAG:
    case TodoActionType.REMOVE_TAG:
      return todoTagReducer(state, action);
    case TodoActionType.UPDATE_STATUS:
      return updateStatusReducer(state, action);
    case TodoActionType.FILTER_BY_STATUS:
      return filterByStatusReducer(state, action);
  }
});

const StoreContext = React.createContext(todoStore);

type StoreType = typeof todoStore;

// Action Creator
// {type:TodoActionType, todo:Todo,tag:string}
// {todo:Todo,tag:string}
// Ommit, Pick

class Actions {
  static addTag: TagActionCreator = payload => ({ ...payload, type: TodoActionType.ADD_TAG });
  static removeTag: TagActionCreator = payload => ({ ...payload, type: TodoActionType.REMOVE_TAG });
  static addTodo: TodoObjectActionCreator = payload => ({ ...payload, type: TodoActionType.ADD });
  static removeTodo: TodoObjectActionCreator = payload => ({
    ...payload,
    type: TodoActionType.REMOVE
  });
  static updateStatus: UpdateStatusActionCreator = payload => ({
    ...payload,
    type: TodoActionType.UPDATE_STATUS
  });
  static filterByStatus: FilterByStatusActionCreator = payload => ({
    ...payload,
    type: TodoActionType.FILTER_BY_STATUS
  });
}

interface TodoItemProps {
  todo: Todo;
}

const mapDispatchToTodoItemProps = (dispatch: (action: any) => void, ownProps: TodoItemProps) => {
  const todo = ownProps.todo;
  return {
    removeTodo: () => dispatch(Actions.removeTodo({ todo })),
    addTag: (tag: string) => dispatch(Actions.addTag({ tag, todo })),
    removeTag: (tag: string) => dispatch(Actions.removeTag({ tag, todo })),
    updateStatus: (targetStatus: Status) => dispatch(Actions.updateStatus({ todo, targetStatus }))
  };
};

type MapStateToProps = (state: TodoAppState, props: any) => any;
type MapToDispatchProps = (dispatch: (action: any) => void, props: any) => any;

const connect = (
  mapStateToProps: MapStateToProps | null,
  mapDispatchToProps: MapToDispatchProps | null
) => {
  return (WrappedComponent: typeof Component) => {
    return class extends Component<any> {
      render() {
        const { getState, dispatch } = todoStore;
        const stateProps = mapStateToProps ? mapStateToProps(getState(), this.props) : {};
        const dispatchProps = mapDispatchToProps ? mapDispatchToProps(dispatch, this.props) : {};
        return <WrappedComponent {...this.props} {...stateProps} {...dispatchProps} />;
      }
      private unsubscribe: Function | undefined;
      componentDidMount() {
        this.unsubscribe = todoStore.subscribe(() => {
          this.forceUpdate();
        });
      }
      componentWillUnmount() {
        this.unsubscribe && this.unsubscribe();
      }
    };
  };
};

type TodoItemDispatchProps = ReturnType<typeof mapDispatchToTodoItemProps>;

class RawTodoItem extends Component<TodoItemProps & TodoItemDispatchProps> {
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
      this.props.addTag(tag);
    }
    this.toggleTags();
  };

  removeTag = (tag: string) => {
    this.props.removeTag(tag);
  };

  removeTodo = () => {
    this.props.removeTodo();
  };

  renderActions = (status: Status) => {
    // status -> action -> targetStatus

    const statusTransitionMap = {
      [Status.CREATED]: [["开始处理", Status.DOING], ["删除", Status.DELETED]],
      [Status.DOING]: [["完成", Status.FINISHED], ["暂停", Status.PAUSE], ["删除", Status.DELETED]],
      [Status.PAUSE]: [["开始处理", Status.DOING], ["删除", Status.DELETED]],
      [Status.FINISHED]: [["删除", Status.DELETED]]
    };

    const actionStatusArray: [string, Status][] = (statusTransitionMap as any)[status];
    if (actionStatusArray) {
      return actionStatusArray.map(([action, targetStatus]) => (
        <button key={action} onClick={() => this.props.updateStatus(targetStatus)}>
          {action}
        </button>
      ));
    } else {
      return <Fragment />;
    }
  };
  render() {
    const todo = this.props.todo;
    const phase = todo.phases[todo.phases.length - 1];
    console.info(`Render TodoItem ${todo.name}`);
    const options = [
      <option value="" key="empty">
        ---
      </option>
    ];
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
            X
          </button>
        </span>
      );
    }
    const firstPhase = todo.phases[0];
    return (
      <tr className="todo">
        <td className="todo-created">{firstPhase.from.toLocaleTimeString()}</td>
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
        <td className="todo-actions">{this.renderActions(phase.status)}</td>
      </tr>
    );
  }
}

let TodoItem = connect(
  null,
  mapDispatchToTodoItemProps
)(RawTodoItem);

export interface ToDoListProps {}

class TodoList extends Component<ToDoListProps> {
  static contextType = StoreContext;
  render() {
    const { getState } = this.context as StoreType;
    const state = getState();
    const todoStatus = (todo: Todo) => {
      const phase = todo.phases[todo.phases.length - 1];
      return phase.status;
    };
    let todos = !state.filterStatus
      ? state.todos
      : state.todos.filter(todo => todoStatus(todo) === state.filterStatus);
    return (
      <tbody>
        {todos.map((todo, index) => {
          return <TodoItem todo={todo} key={todo.name} />;
        })}
      </tbody>
    );
  }
}

interface TodoFormProps {}

class TodoForm extends Component<TodoFormProps> {
  static contextType = StoreContext;
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
    const todo = makeTodo(this.state.name);
    const { dispatch } = this.context as StoreType;
    dispatch(Actions.addTodo({ todo: todo }));
    this.setState({
      name: ""
    });
  };

  render() {
    const { name } = this.state;
    return (
      <form onSubmit={this.submitForm} style={{ marginTop: "8px" }}>
        <label>事项名称:</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={this.handleChange}
          autoComplete="off"
        />
        <input type="button" value="添加" onClick={this.submitForm} style={{ marginLeft: "8px" }} />
      </form>
    );
  }
}
const mapStateToTodoFilterProps: MapStateToProps = (state, ownProps) => ({
  filterStatus: state.filterStatus
});

const mapDispatchToTodoFilterProps: MapToDispatchProps = (dispatch, ownProps) => {
  return {
    filterByStatus: (filterStatus: Status | null) =>
      dispatch(Actions.filterByStatus({ filterStatus }))
  };
};

class RawTodoFilter extends Component<
  ReturnType<typeof mapStateToTodoFilterProps> & ReturnType<typeof mapDispatchToTodoFilterProps>
> {
  render() {
    const filterByStatus = (status: Status | null) => {
      this.props.filterByStatus(status);
    };
    const statusKeys = Object.keys(Status);
    const buttons = statusKeys.map(key => {
      const status = (Status as any)[key];
      const active = this.props.filterStatus === status;
      return (
        <button
          key={status}
          onClick={() => filterByStatus(status)}
          className={active ? "active" : ""}
        >
          {status}
        </button>
      );
    });
    const showAll = !this.props.filterStatus;
    return (
      <div>
        <h3>按状态筛选:</h3>
        <button key="all" onClick={() => filterByStatus(null)} className={showAll ? "active" : ""}>
          所有
        </button>
        {buttons}
      </div>
    );
  }
}

const TodoFilter = connect(
  mapStateToTodoFilterProps,
  mapDispatchToTodoFilterProps
)(RawTodoFilter);

export class TodoApp extends Component {
  unsubscribe: (() => void) | undefined;

  componentDidMount() {
    this.unsubscribe = todoStore.subscribe(() => {
      this.setState(todoStore.getState());
    });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  render() {
    return (
      <div>
        <StoreContext.Provider value={todoStore}>
          <TodoFilter />
          <table>
            <TodoHeader />
            <TodoList />
          </table>
          <TodoForm />
        </StoreContext.Provider>
      </div>
    );
  }
}
