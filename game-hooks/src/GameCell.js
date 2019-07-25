import React from "react";

const Cell = React.memo(({ data, onClick }) => {
  const className = `game-cell ${
    data === 1 ? "own-by-first" : data === 2 ? "own-by-second" : ""
  }`;
  const content = data === 1 ? "X" : data === 2 ? "O" : null;

  return (
    <td onClick={onClick} className={className}>
      {content}
    </td>
  );
});

export default Cell;