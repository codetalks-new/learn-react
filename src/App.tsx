import React from "react";
import "./App.css";
import { TodoApp } from "./TodoApp";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <TodoApp />
      </header>
    </div>
  );
};

export default App;
