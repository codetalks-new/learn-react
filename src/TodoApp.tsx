import React, { Component } from "react";
import { todoStore, StoreContext } from "./store";

import "./TodoApp.css";
import { Actions } from "./actions";
import { TodoFilter } from "./components/TodoFilter";
import { TodoHeader } from "./components/TodoHeader";
import { TodoList } from "./components/TodoList";
import { TodoForm } from "./components/TodoForm";

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

  render() {
    const state = todoStore.getState();
    return (
      <div>
        <StoreContext.Provider value={todoStore}>
          <TodoFilter />
          {state.isLoading ? (
            <span>加载中...</span>
          ) : (
            <table>
              <TodoHeader />
              <TodoList />
            </table>
          )}
          <TodoForm />
        </StoreContext.Provider>
      </div>
    );
  }
}
