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

interface BoardProps {
  squares: SquareValueType[];
  onClick: (i: number) => void;
}

class Board extends Component<BoardProps> {
  renderSquare(i: number) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }
  render() {
    return (
      <div>
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
  readonly state = {
    history: [{ squares: Array(9).fill(null), i: 0 }],
    stepNumber: 0,
    xIsNext: true
  };
  handleClick = (i: number) => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const xIsNext = this.state.xIsNext;
    const current = history[history.length - 1];
    const squares = current.squares.slice(); // 复制
    if (calcWinner(squares) || squares[i]) {
      return; // 已经结束,或者已经点击过了
    }
    squares[i] = xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares, i }]),
      stepNumber: history.length,
      xIsNext: !xIsNext
    });
  };

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calcWinner(current.squares);
    let status;
    if (winner) {
      status = `赢家: ${winner}`;
    } else {
      const nextPlayer = this.state.xIsNext ? "X" : "O";
      status = `下一个玩家 : ${nextPlayer}`;
    }

    const moves = history.map((step, move) => {
      const row = (step.i / 3) | 0;
      const col = step.i % 3;
      const desc = move ? `Go to move #${move}(${row},${col})` : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}> {desc} </button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
