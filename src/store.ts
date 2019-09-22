import { Todo, Status } from "./models";
import {
  TodoAction,
  FilterByStatusAction,
  EmptyAction,
  TodoActionType,
  TodoListAction
} from "./actions";

import { combineReducers, createStore, applyMiddleware } from "redux";

import React from "react";
import thunk from "redux-thunk";

export interface TodoAppState {
  todos: Todo[];
  filterStatus: Status | null;
  isLoading: boolean;
}

const makePreloadState = () => {
  return {
    todos: [],
    filterStatus: null,
    isLoading: false
  };
};
// redux

const filterByStatusReducer = (
  filterStatus: Status | null | undefined,
  action: FilterByStatusAction
) => {
  return action.filterStatus || null;
};
const isLoadingReducer = (isLoading: boolean | null | undefined, action: EmptyAction) => {
  return action.type === TodoActionType.LOAD_TODOS_REQUEST;
};
const todosReducer = (todos: Todo[] | null | undefined, action: TodoListAction) => {
  return action.todos || todos || [];
};

const rootReducer = combineReducers<TodoAppState, any>({
  filterStatus: filterByStatusReducer,
  todos: todosReducer,
  isLoading: isLoadingReducer
});

export const todoStore = createStore<TodoAppState, TodoAction, any, any>(
  rootReducer,
  makePreloadState(),
  applyMiddleware(thunk)
);
export type StoreType = typeof todoStore;

export const StoreContext = React.createContext(todoStore);
