import React from "react";
import "./App.css";
import { TodoApp } from "./TodoApp";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header" style={{ float: "right" }}>
        <h3>欢迎来到代码会说话的编程实验室</h3>
        <p>[React &TypeScript](5) 实现列表状态过滤器</p>
        <TodoApp />
      </header>
    </div>
  );
};

export default App;
