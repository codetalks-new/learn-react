import { Component } from "react";
import React from "react";
import "./Game.css";

interface SquareProps {
  value: number;
}

class Square extends Component<SquareProps> {
  render() {
    return <button className="square">{this.props.value}</button>;
  }
}

class Board extends Component {
  renderSquare(i: number) {
    return <Square value={i} />;
  }
  render() {
    const status = "下一个玩家 : X";
    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

export default class Game extends Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/*status */}</div>
        </div>
      </div>
    );
  }
}
