export type StoreListener = () => void;

export interface Action {
  type: string;
}

export interface State {}

export default function createStore<S extends State, T extends Action>(reducer: (state: S, action: T) => S) {
  let state: S = {} as any;
  const listeners: StoreListener[] = [];
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
    listeners.forEach(listener => listener());
  };

  dispatch({ type: "" } as T);
  return { dispatch, subscribe, getState };
}
