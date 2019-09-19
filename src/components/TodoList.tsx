import React, { Component } from "react";
import { StoreContext, StoreType } from "../store";
import { Todo } from "../models";
import { TodoItem } from "./TodoItem";

export interface ToDoListProps {}

export class TodoList extends Component<ToDoListProps> {
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
