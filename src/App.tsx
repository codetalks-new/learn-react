import React, { Component, MouseEvent } from "react";
import "./App.css";

class MouseTrakcer extends Component {
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
        <h3>在旁边移动下鼠标吧!</h3>
        <p>
          鼠标当前坐标: ({x},{y})
        </p>
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
