import React from "react";
import "./App.css";
import { TodoApp } from "./TodoApp";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header" style={{ float: "right" }}>
        <h3>欢迎来到代码会说话的编程实验室</h3>
        <p>[React &TypeScript](7) 轻松实现 Redux Action Creator - 利用 TS 高级类型 Pick,Omit</p>
        <caption> (TS不仅帮你声明类型,还提供创建类型的助手 ) </caption>
        <TodoApp />
      </header>
    </div>
  );
};

export default App;
