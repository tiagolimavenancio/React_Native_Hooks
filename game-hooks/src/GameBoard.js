import React, { useContext, useMemo, useState } from "react";

import GameCell from "./GameCell";
import { gameContext } from "./GameProvider";
import { useInterval } from "./hooks";

function PureGameCell(props) {
  // this memoization cannot be done in `GameBoard` because hooks can only be
  // called at the top level
  return useMemo(() => <GameCell {...props} />, [props.data]);
}

function GameBoard() {
  const {
    state: { board, winner, isFirstPlayerTurn },
    reset: resetGame,
    play,
    undo,
    redo,
    resize
  } = useContext(gameContext);

  const [firstPlayerTime, setFirstPlayerTime] = useState(0);
  const [secondPlayerTime, setSecondPlayerTime] = useState(0);

  function reset() {
    setFirstPlayerTime(0);
    setSecondPlayerTime(0);
    resetGame();
  }
  useInterval(() => {
    if (winner) return;

    isFirstPlayerTurn
      ? setFirstPlayerTime(firstPlayerTime + 100)
      : setSecondPlayerTime(secondPlayerTime + 100);
  }, 100);

  function loop(fn) {
    return Array(board.length)
      .fill(null)
      .map((_, i) => fn(i));
  }

  return (
    <table>
      <thead>
        <tr>
          <td colSpan="3">
            <div className="game-size-wrapper">
              <label htmlFor="game-size">Board size</label>
              <input
                id="game-size"
                type="number"
                value={board.length}
                onChange={e => resize(Number(e.target.value))}
              />
            </div>
          </td>
        </tr>
        <tr>
          <td colSpan="1">
            <p>{Math.round(firstPlayerTime / 1000)} s</p>
          </td>
          <td colSpan="1" />
          <td colSpan="1">
            <p>{Math.round(secondPlayerTime / 1000)} s</p>
          </td>
        </tr>
      </thead>
      <tbody className="game-board">
        {loop(x => (
          <tr key={x} className="game-row">
            {loop(y => (
              <PureGameCell
                key={`${x}${y}`}
                data={board[x][y]}
                onClick={() => play(x, y)}
              />
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          {String(board.length - 3) > 0 && (
            <td colSpan={String(board.length - 3)} />
          )}
          <td colSpan="1">
            <button className="game-reset" onClick={reset}>
              Reset
            </button>
          </td>
          <td colSpan="1">
            <button className="game-reset" onClick={undo}>
              Undo
            </button>
          </td>
          <td colSpan="1">
            <button className="game-reset" onClick={redo}>
              Redo
            </button>
          </td>
        </tr>
        <tr>
          <td colSpan="3">{winner && `Player ${winner} win.`}</td>
        </tr>
      </tfoot>
    </table>
  );
}

export default GameBoard;