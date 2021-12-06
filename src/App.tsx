import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState
} from "react";
import "./App.css";
import GameCard from "./components/GameCard";
import PipePuzzle from "./games/PipePuzzle";
import { Routes, Route, Outlet, Link } from "react-router-dom";

type Game = {
  component: Function;
  path: string;
  title: string;
  rules?: string;
};
const games: Game[] = [
  {
    component: PipePuzzle,
    path: "pipepuzzle",
    title: "Pipe Puzzle",
    rules: `The goal of the puzzle is to rotate the tiles on the map to make all
          pipes connected in a single group, with no loops and no dangling
          pipes.
          The goal of the puzzle is to rotate the tiles on the map to make all
          pipes connected in a single group, with no loops and no dangling
          pipes.
          To verify if your solution is correct, click on Verify button.`
  },
  {
    component: () => {
      return <p>Another Game</p>;
    },
    title: "Another Game",
    path: "anothergame"
  }
];

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <div className="games">
                {games.map((game, index) => {
                  const Game = game.component;
                  return (
                    <Link
                      key={index}
                      to={`/${game.path}`}
                      className="games-link"
                    >
                      {game.title}
                    </Link>
                  );
                })}
              </div>
            }
          />
          {games.map((game, index) => {
            const Game = game.component;
            return (
              <Route
                path={game.path}
                element={
                  <GameCard title={game.title} rules={game.rules} key={index}>
                    <Game />
                  </GameCard>
                }
              />
            );
          })}
        </Route>
      </Routes>
    </>
  );
}

function Layout() {
  return (
    <div>
      {/* <nav>
        <ul>
          <li>
            <Link to="/" className="navbar">
              Games
            </Link>
          </li>
        </ul>
      </nav> */}
      <Outlet />
    </div>
  );
}

export default App;
