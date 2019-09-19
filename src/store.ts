import { Todo, Status } from "./models";
import {
  TodoAction,
  FilterByStatusAction,
  EmptyAction,
  TodoActionType,
  TodoObjectAction,
  TagAction,
  UpdateStatusAction,
  TodoListAction
} from "./actions";

import { State, Reducer, createStore } from "./redux-lite";
import React from "react";

export interface TodoAppState extends State {
  todos: Todo[];
  filterStatus: Status | null | undefined;
  isLoading: boolean;
}

type TodoAppReducer<T = TodoAction> = Reducer<TodoAppState, T>;

const makePreloadState = () => {
  return {
    todos: [],
    filterStatus: null,
    isLoading: false
  };
};
// redux

const filterByStatusReducer: TodoAppReducer<FilterByStatusAction> = (state, action) => {
  return { ...state, filterStatus: action.filterStatus };
};
const isLoadingReducer: TodoAppReducer<EmptyAction> = (state, action) => {
  if (action.type === TodoActionType.LOAD_TODOS_REQUEST) {
    return { ...state, isLoading: true };
  }
  return state;
};
const todoReducer: TodoAppReducer<
  TodoObjectAction | TagAction | UpdateStatusAction | TodoListAction
> = (state, action) => {
  if (action.type === TodoActionType.LOAD_TODOS_SUCCESS) {
    return { ...state, todos: action.todos, isLoading: false };
  }
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
    case TodoActionType.UPDATE_STATUS:
      {
        const index = todos.indexOf(todo);
        const phases = todo.phases.slice();
        phases.push({ from: new Date(), status: action.targetStatus });
        const newTodo = { ...todo, phases };
        todos[index] = newTodo;
      }
      break;
  }
  return { ...state, todos };
};

type ReducerKeys = keyof TodoAppState;
type Reducers = {
  [K in ReducerKeys]: TodoAppReducer<any>;
};

const combineReducers = (reducers: Reducers): TodoAppReducer => {
  const combinedReducer: TodoAppReducer = (state, action) => {
    const keys = Object.keys(reducers);
    let newState = state;
    for (const key of keys) {
      const reducer = (reducers as any)[key];
      newState = reducer(newState, action);
    }
    return newState;
  };
  return combinedReducer;
};
// const rootReducer: TodoAppReducer = (state, action) => {
//   if (action.type === TodoActionType.FILTER_BY_STATUS) {
//     return filterByStatusReducer(state, action);
//   } else {
//     return todoReducer(state, action);
//   }
// };

const rootReducer = combineReducers({
  filterStatus: filterByStatusReducer,
  todos: todoReducer,
  isLoading: isLoadingReducer
});

export const todoStore = createStore<TodoAction, TodoAppState>(rootReducer, makePreloadState());
export type StoreType = typeof todoStore;

export const StoreContext = React.createContext(todoStore);
