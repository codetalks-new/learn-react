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
  ROWS = 3;
  COLS = 3;
  renderSquare(i: number) {
    return <Square key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }
  render() {
    const rows = [];
    for (let r = 0; r < this.ROWS; r++) {
      const cols = [];
      for (let c = 0; c < this.COLS; c++) {
        const i = r * this.COLS + c;
        const cell = this.renderSquare(i);
        cols.push(cell);
      }
      rows.push(
        <div key={r} className="board-row">
          {cols}
        </div>
      );
    }
    return <div> {rows} </div>;
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
      const liClass = this.state.stepNumber === move ? "move-item-selected" : "move-item";
      return (
        <li key={move} className={liClass}>
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
