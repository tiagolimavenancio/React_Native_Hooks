import React from "react";

import GameProvider from "./GameProvider";
import GameBoard from "./GameBoard";
import "./Board.css";

function App() {
  return (
    <div className="App">
      <GameProvider>
        <GameBoard />
      </GameProvider>
    </div>
  );
}

export default App;
