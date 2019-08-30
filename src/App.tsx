import React from "react";
import logo from "./logo.svg";
import "./App.css";
import ClassBasedComp, { TodoTable } from "./Cbc";
import BasicFc from "./Fc";
import { Todo } from "./models";

function currentTime() {
  return new Date().toISOString();
}

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <p>当前时间: {currentTime()} </p>
        <ClassBasedComp />
        <BasicFc />
        <TodoTable />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
