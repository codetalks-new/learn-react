import { Component } from "react";
import React from "react";
import "./Game.css";

type SquareValueType = null | "X" | "O";
interface SquareProps {
  value: SquareValueType;
  onClick: () => void;
}

const Square = (props: SquareProps) => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
};

const calcWinner = (squares: SquareValueType[]): SquareValueType => {
  const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

interface BoardState {
  squares: SquareValueType[];
  xIsNext: boolean;
}

class Board extends Component {
  readonly state: BoardState = {
    squares: Array(9).fill(null),
    xIsNext: true
  };
  handleClick = (i: number) => {
    const squares = this.state.squares.slice(); // 复制
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({ squares: squares, xIsNext: !this.state.xIsNext });
  };
  renderSquare(i: number) {
    return <Square value={this.state.squares[i]} onClick={() => this.handleClick(i)} />;
  }
  render() {
    const winner = calcWinner(this.state.squares);
    let status;
    if (winner) {
      status = `赢家: ${winner}`;
    } else {
      const nextPlayer = this.state.xIsNext ? "X" : "O";
      status = `下一个玩家 : ${nextPlayer}`;
    }
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
