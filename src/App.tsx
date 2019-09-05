import React, { Component, MouseEvent, createRef, useState, useEffect } from "react";
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
      y: event.pageY
    });
    console.info(
      `client(X,Y):${event.clientX},${event.clientY}, page(X,Y):${event.pageX},${event.pageY}, screen(X,Y):${event.screenX},${event.screenY},movement(X,Y):${event.movementX},${event.movementY}`
    );
  };
  render() {
    return (
      <div
        style={{ height: "100%", border: "1px solid orange", width: "100%", position: "relative" }}
        onMouseMove={this.handleMouseMove}
      >
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
    let top = y;
    if (img) {
      const { clientWidth, clientHeight } = img;
      // console.info(
      // `img(clientWidth,clientHeight):${img.clientWidth}, ${img.clientHeight},img(width,height):${img.width},${img.height}`
      // );
      left = x - clientWidth * 0.5;
      top = y - clientHeight * 0.5;
    }

    return <img ref={this.imgRef} src={imgCat} alt="小猫" style={{ position: "absolute", left, top }} />;
  }
}

const MouseTracker = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event: MouseEvent) => {
    setMouse({
      x: event.clientX,
      y: event.pageY
    });
    // console.info(
    // `client(X,Y):${event.clientX},${event.clientY}, page(X,Y):${event.pageX},${event.pageY}, screen(X,Y):${event.screenX},${event.screenY},movement(X,Y):${event.movementX},${event.movementY}`
    // );
  };
  return (
    <div style={{ height: "100%" }} onMouseMove={handleMouseMove}>
      <h3>在旁边移动下鼠标吧!</h3>
      <Cat mouse={mouse} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="App" style={{ height: "100%" }}>
      <MouseTracker />
    </div>
  );
};

export default App;
