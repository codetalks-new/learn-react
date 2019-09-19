import { Action, AsyncAction } from "./redux-lite";
import { Status, Todo } from "./models";
import { loadTodos } from "./services";
export enum TodoActionType {
  ADD_TAG = "add_tag",
  REMOVE_TAG = "remove_tag",
  ADD = "add",
  REMOVE = "remove",
  UPDATE_STATUS = "update_status",
  FILTER_BY_STATUS = "filter_by_status",
  LOAD_TODOS_SUCCESS = "load_todos_success",
  LOAD_TODOS_REQUEST = "load_todos_request"
}

export type ActionCreator<T extends Action> = (payload: Omit<T, "type">) => T;

export interface EmptyAction extends Action {}

// payload
export interface TodoObjectAction extends Action {
  type: TodoActionType.ADD | TodoActionType.REMOVE;
  todo: Todo;
}

export interface TodoListAction extends Action {
  type: TodoActionType.LOAD_TODOS_SUCCESS;
  todos: Todo[];
}

export type TodoObjectActionCreator = ActionCreator<TodoObjectAction>;

export interface TagAction extends Action {
  type: TodoActionType.ADD_TAG | TodoActionType.REMOVE_TAG;
  todo: Todo;
  tag: string;
}
export type TagActionCreator = ActionCreator<TagAction>;

export interface UpdateStatusAction extends Action {
  type: TodoActionType.UPDATE_STATUS;
  todo: Todo;
  targetStatus: Status;
}
export type UpdateStatusActionCreator = ActionCreator<UpdateStatusAction>;

export interface FilterByStatusAction extends Action {
  type: TodoActionType.FILTER_BY_STATUS;
  filterStatus: Status | null | undefined;
}
export type FilterByStatusActionCreator = ActionCreator<FilterByStatusAction>;

export type TodoAction =
  | TodoObjectAction
  | TagAction
  | UpdateStatusAction
  | FilterByStatusAction
  | TodoListAction
  | EmptyAction;

// Action Creator
// {type:TodoActionType, todo:Todo,tag:string}
// {todo:Todo,tag:string}
// Ommit, Pick

export class Actions {
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
  static loadTodosSuccess: ActionCreator<TodoListAction> = payload => ({
    ...payload,
    type: TodoActionType.LOAD_TODOS_SUCCESS
  });
  static loadTodosRequest = () => ({ type: TodoActionType.LOAD_TODOS_REQUEST });

  static loadTodos = () => {
    const call: AsyncAction = (dispatch, state) => {
      dispatch(Actions.loadTodosRequest());
      loadTodos().then(todos => {
        dispatch(Actions.loadTodosSuccess({ todos }));
      });
    };
    return call;
  };
}
