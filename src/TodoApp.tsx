import React, { Component } from "react";
import { todoStore, StoreContext, TodoAppState } from "./store";

import "./TodoApp.css";
import { Actions } from "./actions";
import { TodoFilter } from "./components/TodoFilter";
import { TodoForm } from "./components/TodoForm";
import { Status, Todo, BuiltinTag, Phase, tagToColor, TodoX, statusToButtonProps } from "./models";
import { Spin, Table, Tag, Button, Menu, Dropdown, Icon } from "antd";
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

export class TodoApp extends Component {
  unsubscribe: (() => void) | undefined;

  componentDidMount() {
    this.unsubscribe = todoStore.subscribe(() => {
      this.setState(todoStore.getState());
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
        {buttons}
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
    todoStore.dispatch(Actions.updateStatus({ todo, targetStatus }));
  };

  render() {
    const state = todoStore.getState();
    return (
      <div>
        <StoreContext.Provider value={todoStore}>
          <ConnectedTodoFilter />
          <Table dataSource={state.todos} columns={this.columns} rowKey="name" />
          <TodoForm />
        </StoreContext.Provider>
      </div>
    );
  }
}
