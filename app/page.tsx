'use client'
import React, { useState } from "react";
import styles from "./styles.module.css";

type squareValue = string | null;

function calculateWinner(squares: squareValue[]) {
  const lines:number[][] = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];
  for(let i = 0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

function Square(
  { value, onSquareClick }: 
  {value:squareValue, onSquareClick: React.MouseEventHandler<HTMLButtonElement>}
) {
  return (
    <button className={styles.square} onClick={onSquareClick}>{ value }</button>
  );
}

function Board(

  { xIsNext, squares, onPlay }:
  { xIsNext:boolean, squares: squareValue[], onPlay: (nextSquares: squareValue[]) => void }
) {
  
  const winner:squareValue = calculateWinner(squares);
  let status: string;

  if(winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function handleClick(i:number): void {
    if (squares[i] || calculateWinner(squares)) {return;}

    const nextSquares = squares.slice();
    
    if(xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

 return (
  <>
    <div className="status">{ status }</div>
    <div className={styles["board-row"]}>
      <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
      <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
      <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
    </div>
    <div className={styles["board-row"]}>
      <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
      <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
      <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
    </div>
    <div className={styles["board-row"]}>
      <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
      <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
      <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
    </div>
  </>
 );
}

export default function Game() {
  const [history, setHistory] = useState<squareValue[][]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const xIsNext: boolean = (currentMove % 2) === 0;
  const currentSquares: squareValue[] = history[currentMove];

  function handlePlay(nextSquares: squareValue[]): void {
    const nextHistory: squareValue[][] = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number): void {
    setCurrentMove(nextMove);
  }

  const moves: React.JSX.Element[] = history.map((squares: squareValue[], move: number) => {
    let description: string;
    if(move > 0 && move != currentMove) {
      description = "Go to move #" + move;
    } else if (move === currentMove) {
      description = "You are at move # " + currentMove;
      return(
        <li key={move}>
          <p className={styles["current-move"]}>{description}</p>
        </li>
      );
    } else {
      description = "Go to game start";
    }


    return(
      <li key={move}>
        <button className={styles["moves"]} onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}