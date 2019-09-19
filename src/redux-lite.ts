export interface Action {
  type: string; //操作类型
}

export type AsyncAction = (dispatch: Function, state: any) => void;

export type StoreListener = () => void;

export interface State {}

// redux
export type Reducer<S, T> = (state: S, action: T) => S;

export const __init_action_type = "INIT_STORE";
export function createStore<T extends Action, S extends State>(
  reducer: (state: S, action: T) => S,
  preloadState?: S
) {
  const listeners: StoreListener[] = [];
  let state: S = preloadState || ({} as any);
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
  const dispatch = (action: T | AsyncAction) => {
    if (typeof action === "function") {
      action(dispatch, state);
    } else {
      state = reducer(state, action);
      // midllware
      listeners.forEach(listener => listener());
    }
  };
  dispatch({ type: __init_action_type } as T);
  return { dispatch, subscribe, getState };
}
