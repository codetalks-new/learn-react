import React from "react";
import "./App.css";
import { TodoApp } from "./TodoApp";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header" style={{ float: "right" }}>
        <h3>欢迎来到代码会说话的编程实验室</h3>
        <p>
          [React &TypeScript](6) 利用TypeScript 高级类型 Discriminated Unions
          优化 Redux Action
        </p>
        <caption> (Discriminated Unions: 带智能推断的联合类型) </caption>
        <TodoApp />
      </header>
    </div>
  );
};

export default App;
