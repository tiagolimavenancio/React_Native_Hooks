import React, { useReducer } from "react";
import produce, { nothing } from "immer";

const gameContext = React.createContext();

function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, makeInitialState(3));

  function reducer(state, action) {
    return produce(state, draft => {
      switch (action.type) {
        case "play": {
          const { x, y } = action;

          if (!state.winner && !state.board[x][y]) {
            draft.board[x][y] = state.isFirstPlayerTurn ? 1 : 2;
            draft.isFirstPlayerTurn = !state.isFirstPlayerTurn;
            draft.winner = getWinner(draft.board);
            draft.previousState = state;
            draft.nextState = null;
          }

          break;
        }
        case "reset":
          return makeInitialState(state.board.length);
        case "undo":
          return state.previousState
            ? {
                ...state.previousState,
                nextState: state
              }
            : state;
        case "redo":
          return state.nextState || state;
        case "resize":
          return makeInitialState(action.size);
        default:
      }
    });
  }

  return (
    <gameContext.Provider
      value={{
        state,
        play: (x, y) => dispatch({ type: "play", x, y }),
        reset: () => dispatch({ type: "reset" }),
        undo: () => dispatch({ type: "undo" }),
        redo: () => dispatch({ type: "redo" }),
        resize: size => dispatch({ type: "resize", size })
      }}
    >
      {children}
    </gameContext.Provider>
  );
}

/**
 * Creates a new game state.
 * @param size size of the board to create
 */
function makeInitialState(size = 3) {
  return {
    board: Array(size).fill(Array(size).fill(null)),
    isFirstPlayerTurn: true,
    winner: null,
    previousState: null,
    nextState: null
  };
}

/**
 * Returns the owner of a list of cells, or `null` if all the cells are not
 * owned by a single player.
 */
function getOwner(first, ...others) {
  const candidate = first;

  return candidate !== null && others.every(cell => cell === candidate)
    ? candidate
    : null;
}

/**
 * Returns the column at the given index for a given board.
 * @param x index of the column
 * @param board board to parse
 */
function getCol(x, board) {
  return board.reduce((col, row) => {
    col.push(row[x]);
    return col;
  }, []);
}

/**
 * Get the two diagonals cells for a board.
 * @param board board to parse
 */
function getDiags(board) {
  return [
    board.map((row, x) => row[x]),
    board.map((row, x) => row[board.length - x - 1])
  ];
}

/**
 * Checks if there's an owner for any row, column or diagonal and returns it
 * as the winner.
 * @param board board to parse
 */
function getWinner(board) {
  const [leftDiag, rightDiag] = getDiags(board);

  return (
    getOwner(...leftDiag) ||
    getOwner(...rightDiag) ||
    board.reduce(
      (winner, row, x) =>
        winner || getOwner(...row) || getOwner(...getCol(x, board)),
      null
    )
  );
}

export { gameContext };
export default GameProvider;