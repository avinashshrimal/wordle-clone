import { useState } from "react";
import Nav from "./Nav";
import Home from "./Home";
import MemoryGame from "./MemoryGame";
import WordlePro from "./WordlePro";



export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div style={{ background: "#0a0a0e", minHeight: "100vh" }}>
      <Nav page={page} setPage={setPage} />
      {page === "home"   && <Home setPage={setPage} />}
      {page === "wordle" && <WordlePro />}
      {page === "memory" && <MemoryGame />}
    </div>
  );
}
