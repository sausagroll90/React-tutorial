import { useState } from "react";

function Square({ winning, value, onSquareClick }) {
  return (
    <button className="square" winning={winning} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const coords = [
    [1, 3],
    [2, 3],
    [3, 3],
    [1, 2],
    [2, 2],
    [3, 2],
    [1, 3],
    [2, 3],
    [3, 3],
  ];

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    nextSquares[9] = coords[i];
    onPlay(nextSquares);
  }

  const winningSquares = calculateWinner(squares);
  let status;
  if (winningSquares) {
    status = "Winner: " + squares[winningSquares[0]];
  } else {
    if (!squares.includes(null)) {
      status = "It's a tie!";
    } else {
      status = "Next player: " + (xIsNext ? "X" : "O");
    }
  }

  const rows = [];
  var rowSquares = [];
  for (let row = 0; row < 3; row++) {
    rowSquares = [];
    for (let rowSquare = 0; rowSquare < 3; rowSquare++) {
      if (winningSquares && winningSquares.includes(3 * row + rowSquare)) {
        rowSquares.push(
          <Square
            winning="yes"
            value={squares[3 * row + rowSquare]}
            onSquareClick={() => handleClick(3 * row + rowSquare)}
          />
        );
      } else {
        rowSquares.push(
          <Square
            value={squares[3 * row + rowSquare]}
            onSquareClick={() => handleClick(3 * row + rowSquare)}
          />
        );
      }
    }
    rows.push(<div className="board-row">{rowSquares}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(10).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascending, setAscending] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  console.log("test");

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === currentMove) {
      description = "You are at move #" + move + " (" + squares[9] + ")";
      return <li key={move}>{description}</li>;
    } else {
      if (move > 0) {
        description = "Go to move #" + move + " (" + squares[9] + ")";
      } else {
        description = "Go to game start";
      }
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
  });

  if (ascending) {
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      <div>
        <button onClick={() => setAscending(!ascending)}>Toggle order</button>
      </div>
    </div>
  );
}
