import { Component } from "react";
import React from "react";
import "./Game.css";

type SquareValueType = null | "X" | "O";
interface SquareProps {
  value: SquareValueType;
  onClick: () => void;
}

interface SquareState {
  value: SquareValueType;
}

class Square extends Component<SquareProps> {
  readonly state: SquareState = {
    value: null
  };
  render() {
    return (
      <button className="square" onClick={this.props.onClick}>
        {this.props.value}
      </button>
    );
  }
}

interface BoardState {
  squares: SquareValueType[];
}

class Board extends Component {
  readonly state: BoardState = {
    squares: Array(9).fill(null)
  };
  handleClick = (i: number) => {
    const squares = this.state.squares.slice(); // 复制
    squares[i] = "X";
    this.setState({ squares: squares });
  };
  renderSquare(i: number) {
    return <Square value={this.state.squares[i]} onClick={() => this.handleClick(i)} />;
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
