import React, { Component } from "react";
import { todoStore, StoreContext, TodoAppState } from "./store";

import "./TodoApp.css";
import { Actions } from "./actions";
import { TodoFilter } from "./components/TodoFilter";
import { CreateTodoForm, UpdateTodoForm } from "./components/TodoForm";
import { Status, Todo, BuiltinTag, Phase, tagToColor, TodoX, statusToButtonProps } from "./models";
import { Spin, Table, Tag, Button, Menu, Dropdown, Icon, Modal } from "antd";
import { ColumnProps } from "antd/lib/table";

function mapStateToTodoFilterProps(state: TodoAppState, ownProps: any) {
  return {
    filterStatus: state.filterStatus
  };
}

function mapDispatchToTodoFilterProps(dispatch: Function, ownProps: any) {
  return {
    filterByStatus: (status: Status | null) =>
      dispatch(Actions.filterByStatus({ filterStatus: status }))
  };
}
// React-redux connect
function connect(
  mapStateToProps: (state: TodoAppState, ownProps: any) => any,
  mapDispatchToProps: (dispatch: Function, ownProps: any) => any
) {
  const wrap = (WrappedComponent: typeof Component) => {
    const ConnectComponent = (props: any) => {
      return (
        <StoreContext.Consumer>
          {store => (
            <WrappedComponent
              {...props}
              {...mapStateToProps(store.getState(), props)}
              {...mapDispatchToProps(store.dispatch, props)}
            />
          )}
        </StoreContext.Consumer>
      );
    };
    return ConnectComponent;
  };
  return wrap;
}

const ConnectedTodoFilter = connect(
  mapStateToTodoFilterProps,
  mapDispatchToTodoFilterProps
)(TodoFilter);

interface TodoAppComponentState {
  showCreateForm: boolean;
  showUpdateForm: boolean;
  currentUpdateTodo: Todo | null;
  todos: Todo[];
}

export class TodoApp extends Component<{}, TodoAppComponentState> {
  state = {
    showCreateForm: false,
    showUpdateForm: false,
    currentUpdateTodo: null,
    todos: []
  };
  unsubscribe: (() => void) | undefined;

  componentDidMount() {
    this.unsubscribe = todoStore.subscribe(() => {
      this.setState({ todos: todoStore.getState().todos });
    });
    // Vue#mounted isLoading
    // Redux-thunk  redux-saga yield generator
    todoStore.dispatch(Actions.loadTodos());
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  private columns: ColumnProps<Todo>[] = [
    {
      title: "名称",
      dataIndex: "name"
    },
    {
      title: "标签",
      dataIndex: "tags",
      render: (tags: string[]) => (
        <span>
          {tags.map(tag => {
            return (
              <Tag key={tag} color={tagToColor(tag)}>
                {tag}
              </Tag>
            );
          })}
        </span>
      )
    },
    {
      title: "状态",
      dataIndex: "phases",
      render: (phases: Phase[]) => {
        const phase = phases[phases.length - 1];
        return <span>{phase.status}</span>;
      }
    },
    {
      title: "操作",
      key: "action",
      render: (text, todo) => {
        return this.renderActions(todo);
      }
    }
  ];

  renderActions = (todo: Todo) => {
    const todox = new TodoX(todo);
    const actions = todox.currentAvailableActions;
    if (!actions) {
      return <span>{""}</span>;
    }
    const moreActions = actions.filter(action => action[1] === Status.DELETED);
    const normalActions = actions.filter(action => action[1] !== Status.DELETED);
    const moreActionMenu = (
      <Menu>
        <Menu.Item key="update" onClick={() => this.showUpdateForm(todo)}>
          编辑
        </Menu.Item>
        {moreActions.map(([title, targetStatus]) => (
          <Menu.Item key={targetStatus}>
            <a href="#!" onClick={() => this.updateStatus(todo, targetStatus)}>
              {title}
            </a>
          </Menu.Item>
        ))}
      </Menu>
    );
    const buttons = normalActions.map(([title, targetStatus]) => (
      <Button
        key={title}
        {...statusToButtonProps(targetStatus)}
        onClick={() => this.updateStatus(todo, targetStatus)}
      />
    ));

    return (
      <>
        {buttons}{" "}
        <Dropdown overlay={moreActionMenu} trigger={["click"]}>
          <a className="ant-dropdown-link" href="#">
            更多
            <Icon type="down" />
          </a>
        </Dropdown>
      </>
    );
  };

  updateStatus = (todo: Todo, targetStatus: Status) => {
    if (targetStatus === Status.DELETED) {
      this.confirmDelete(todo);
    } else {
      todoStore.dispatch(Actions.updateStatus({ todo, targetStatus }));
    }
  };

  confirmDelete = (todo: Todo) => {
    Modal.confirm({
      title: "确定要删除此办事项?",
      content: todo.name,
      onCancel() {},
      onOk: () => todoStore.dispatch(Actions.updateStatus({ todo, targetStatus: Status.DELETED }))
    });
  };

  showCreateForm = () => {
    this.setState({
      showCreateForm: true
    });
  };

  hideCreateForm = () => {
    this.setState({
      showCreateForm: false
    });
  };

  showUpdateForm = (todo: Todo) => {
    this.setState({
      showUpdateForm: true,
      currentUpdateTodo: todo
    });
  };

  hideUpdateForm = () => {
    this.setState({
      showUpdateForm: false,
      currentUpdateTodo: null
    });
  };

  render() {
    const state = todoStore.getState();
    const { showCreateForm, showUpdateForm, currentUpdateTodo } = this.state;
    return (
      <div>
        <StoreContext.Provider value={todoStore}>
          <Button icon="plus" type="primary" onClick={this.showCreateForm}>
            新建
          </Button>
          <ConnectedTodoFilter />
          <Table dataSource={state.todos} columns={this.columns} rowKey="name" />

          <CreateTodoForm visible={showCreateForm} onHideModal={this.hideCreateForm} />
          {currentUpdateTodo && (
            <UpdateTodoForm
              visible={showUpdateForm}
              onHideModal={this.hideUpdateForm}
              todo={currentUpdateTodo!}
            />
          )}
        </StoreContext.Provider>
      </div>
    );
  }
}
