import React, { Component, MouseEvent, createRef } from "react";
import "./App.css";
import imgCat from "./cat.jpeg";

interface Point {
  x: number;
  y: number;
}

class Mouse extends Component<{ render: (mouse: Point) => any }> {
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
    return (
      <div style={{ height: "100%" }} onMouseMove={this.handleMouseMove}>
        <p>{this.props.render(this.state)}</p>
      </div>
    );
  }
}

class Cat extends Component<{ mouse: Point }> {
  imgRef = createRef<HTMLImageElement>();
  componentDidMount() {
    console.info("Cat componentDidMount");
  }
  render() {
    console.info("Cat render");
    const { x, y } = this.props.mouse;
    const img = this.imgRef.current;
    let left = x;
    let right = y;
    if (img) {
      const { clientWidth, clientHeight } = img;
      left = x - clientWidth * 0.5;
      right = y - clientHeight * 0.5;
    }

    return <img ref={this.imgRef} src={imgCat} alt="小猫" style={{ position: "absolute", left: left, right: right }} />;
  }
}

class MouseTrakcer extends Component {
  render() {
    return (
      <div>
        <h3>在旁边移到下鼠标吧!</h3>
        <Mouse render={mouse => <Cat mouse={mouse} />} />
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
