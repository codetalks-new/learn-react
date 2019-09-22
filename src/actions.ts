import { Action, AnyAction, Dispatch, ActionCreator } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { Status, Todo } from "./models";
import * as todoService from "./services";
export enum TodoActionType {
  FILTER_BY_STATUS = "filter_by_status",
  LOAD_TODOS_SUCCESS = "load_todos_success",
  SAVE_TODOS = "save_todos",
  LOAD_TODOS_REQUEST = "load_todos_request"
}

export type ActionCreator<T extends Action> = (payload: Omit<T, "type">) => T;

export interface EmptyAction extends Action {}

export interface TodoListAction extends Action {
  type: TodoActionType.LOAD_TODOS_SUCCESS | TodoActionType.SAVE_TODOS;
  todos: Todo[];
}

export interface FilterByStatusAction extends Action {
  type: TodoActionType.FILTER_BY_STATUS;
  filterStatus: Status | null | undefined;
}
export type FilterByStatusActionCreator = ActionCreator<FilterByStatusAction>;

export type TodoAction = FilterByStatusAction | TodoListAction | EmptyAction;

// Action Creator
// {type:TodoActionType, todo:Todo,tag:string}
// {todo:Todo,tag:string}
// Ommit, Pick

export class Actions {
  static addTodoAsync = (todo: Todo) => (dispatch: Dispatch) => {
    todoService.addTodo(todo).then(todos => {
      dispatch({ type: TodoActionType.SAVE_TODOS, todos });
    });
  };
  static updateTodoAsync = (todo: Todo) => (dispatch: Dispatch) => {
    todoService.updateTodo(todo).then(todos => {
      dispatch({ type: TodoActionType.SAVE_TODOS, todos });
    });
  };

  static filterByStatus: FilterByStatusActionCreator = payload => ({
    ...payload,
    type: TodoActionType.FILTER_BY_STATUS
  });
  static loadTodosSuccess: ActionCreator<TodoListAction> = payload => ({
    ...payload,
    type: TodoActionType.LOAD_TODOS_SUCCESS
  });
  static loadTodosRequest = () => ({ type: TodoActionType.LOAD_TODOS_REQUEST });

  static loadTodos = () => (dispatch: Dispatch) => {
    dispatch(Actions.loadTodosRequest());
    todoService.loadTodos().then(todos => {
      dispatch(Actions.loadTodosSuccess({ todos }));
    });
  };
}
