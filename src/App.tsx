import React, { Component, MouseEvent } from "react";
import "./App.css";

class Mouse extends Component {
  state = {
    x: 0,
    y: 0
  };
  handleMouseMove = (event: MouseEvent) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  };
  render() {
    const { x, y } = this.state;
    return (
      <div style={{ height: "100%" }} onMouseMove={this.handleMouseMove}>
        <p>
          鼠标当前坐标: ({x},{y})
        </p>
      </div>
    );
  }
}

class MouseTrakcer extends Component {
  render() {
    return (
      <div>
        <h3>在旁边移到下鼠标吧!</h3>
        <Mouse />
      </div>
    );
  }
}

const App: React.FC = () => {
  return (
    <div className="App" style={{ height: "100%" }}>
      <MouseTrakcer />
    </div>
  );
};

export default App;
