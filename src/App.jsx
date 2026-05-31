import StoryBuilder from "./pages/story-builder/index";
import TicTacToe from "./pages/tic-tac-toe/index";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TicTacToe />} />
        <Route path="/story" element={<StoryBuilder />} />
      </Routes>
    </BrowserRouter>
  );
}
