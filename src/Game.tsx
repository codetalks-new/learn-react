import { Component } from "react";
import React from "react";
import "./Game.css";

type SquareValueType = null | "X" | "O";
interface SquareProps {
  value: SquareValueType;
  inWinLine: boolean;
  onClick: () => void;
}

const Square = (props: SquareProps) => {
  const className = props.inWinLine ? "square square-win" : "square";
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
};

type Line = [number, number, number];
type Player = "X" | "O";
interface Winner {
  player: Player;
  line: Line;
}

const calcWinner = (squares: SquareValueType[]): Winner | null => {
  const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  for (const line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return { player: squares[a]!, line: [a, b, c] };
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
  winner: Winner | null;
  onClick: (i: number) => void;
}

const ROWS = 3;
const COLS = 3;
class Board extends Component<BoardProps> {
  renderSquare(i: number) {
    const winner = this.props.winner;
    const inWinLine = Boolean(winner && winner.line.includes(i));
    return <Square inWinLine={inWinLine} key={i} value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }
  render() {
    const rows = [];
    for (let r = 0; r < ROWS; r++) {
      const cols = [];
      for (let c = 0; c < COLS; c++) {
        const i = r * COLS + c;
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
    xIsNext: true,
    winner: null,
    isAscending: true
  };
  handleClick = (i: number) => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const xIsNext = this.state.xIsNext;
    const current = history[history.length - 1];
    const squares = current.squares.slice(); // 复制
    const winner = calcWinner(squares);
    if (winner || squares[i]) {
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

  toggleSortType = () => {
    this.setState({
      isAscending: !this.state.isAscending
    });
  };

  render() {
    const { history, xIsNext, isAscending } = this.state;
    const current = history[this.state.stepNumber];
    const winner = calcWinner(current.squares);
    let status;
    if (winner) {
      status = `赢家: ${winner.player}`;
    } else {
      const nextPlayer = xIsNext ? "X" : "O";
      const endStep = ROWS * COLS;
      if (this.state.stepNumber < endStep) {
        status = `下一个玩家 : ${nextPlayer}`;
      } else {
        status = `平局`;
      }
    }
    const history_list = isAscending ? history : history.slice().reverse();
    const MOVE_CONT = history_list.length;
    const moves = history_list.map((step, raw_move) => {
      const row = (step.i / 3) | 0;
      const col = step.i % 3;
      const move = isAscending ? raw_move : MOVE_CONT - raw_move - 1;
      const desc = move ? `Go to move #${move}(${row},${col})` : "Go to game start";
      const liClass = this.state.stepNumber === move ? "move-item-selected" : "move-item";
      return (
        <li key={move} className={liClass}>
          <span className="move-no">{move}</span> <button onClick={() => this.jumpTo(move)}> {desc} </button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} winner={winner} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={this.toggleSortType}>{isAscending ? "升序" : "降序"}</button>
          <ul>{moves}</ul>
        </div>
      </div>
    );
  }
}
