import { useState, useEffect, useCallback, useRef } from "react";

const EMOJI_SETS = {
  animals:  ["🦊","🐼","🦁","🐸","🦋","🐬","🦄","🐙","🦀","🦜","🐺","🦓"],
  food:     ["🍕","🍣","🌮","🍩","🍦","🥑","🍓","🍜","🧁","🥞","🍇","🌽"],
  space:    ["🚀","🌙","⭐","🪐","☄️","🌌","👽","🛸","🌠","🔭","💫","🌍"],
  sports:   ["⚽","🏀","🎾","🏈","⚾","🏐","🎱","🏓","🥊","🎯","🏹","🛹"],
};

const GRID_CONFIGS = {
  easy:   { cols: 4, pairs: 6,  label: "4×3", timeLimit: 60  },
  medium: { cols: 4, pairs: 8,  label: "4×4", timeLimit: 90  },
  hard:   { cols: 6, pairs: 12, label: "6×4", timeLimit: 120 },
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(difficulty, theme) {
  const cfg = GRID_CONFIGS[difficulty];
  const emojis = shuffle(EMOJI_SETS[theme]).slice(0, cfg.pairs);
  return shuffle([...emojis, ...emojis].map((e, i) => ({
    id: i, emoji: e, flipped: false, matched: false,
  })));
}

function loadBest() {
  try { return JSON.parse(localStorage.getItem("memory_best") || "{}"); } catch { return {}; }
}
function saveBest(b) {
  try { localStorage.setItem("memory_best", JSON.stringify(b)); } catch {}
}

export default function MemoryGame() {
  const [difficulty, setDifficulty] = useState("medium");
  const [theme, setTheme] = useState("animals");
  const [cards, setCards] = useState(() => buildDeck("medium", "animals"));
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [best, setBest] = useState(loadBest);
  const [locked, setLocked] = useState(false);
  const [combo, setCombo] = useState(0);
  const [showCombo, setShowCombo] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const timerRef = useRef(null);
  const cfg = GRID_CONFIGS[difficulty];
  const timeLeft = cfg.timeLimit - time;

  useEffect(() => {
    if (running && !won && !lost) {
      timerRef.current = setInterval(() => {
        setTime(t => {
          if (t + 1 >= cfg.timeLimit) {
            clearInterval(timerRef.current);
            setRunning(false);
            setLost(true);
            return t + 1;
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [running, won, lost, cfg.timeLimit]);

  const newGame = useCallback(() => {
    clearInterval(timerRef.current);
    setCards(buildDeck(difficulty, theme));
    setFlipped([]); setMoves(0); setTime(0);
    setRunning(false); setWon(false); setLost(false);
    setLocked(false); setCombo(0); setCelebrating(false);
  }, [difficulty, theme]);

  useEffect(() => { newGame(); }, [difficulty, theme]);

  const flip = useCallback((id) => {
    if (locked || won || lost) return;
    const card = cards.find(c => c.id === id);
    if (!card || card.flipped || card.matched) return;
    if (!running) setRunning(true);

    const newFlipped = [...flipped, id];
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setLocked(true);
      setMoves(m => m + 1);
      const [a, b] = newFlipped.map(fid => cards.find(c => c.id === fid));

      if (a.emoji === b.emoji) {
        // Match!
        const newCombo = combo + 1;
        setCombo(newCombo);
        if (newCombo >= 2) { setShowCombo(true); setTimeout(() => setShowCombo(false), 900); }
        setTimeout(() => {
          setCards(prev => {
            const updated = prev.map(c =>
              c.id === a.id || c.id === b.id ? { ...c, matched: true, flipped: true } : c
            );
            const allMatched = updated.every(c => c.matched);
            if (allMatched) {
              clearInterval(timerRef.current);
              setRunning(false); setWon(true); setCelebrating(true);
              setTimeout(() => setCelebrating(false), 2000);
              const key = `${difficulty}_${theme}`;
              const score = Math.round((cfg.pairs * 1000) / (moves + 1) + (timeLeft * 10));
              setBest(prev => {
                const nb = { ...prev, [key]: Math.max(prev[key] || 0, score) };
                saveBest(nb); return nb;
              });
            }
            return updated;
          });
          setFlipped([]); setLocked(false);
        }, 500);
      } else {
        // No match
        setCombo(0);
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newFlipped.includes(c.id) && !c.matched ? { ...c, flipped: false } : c
          ));
          setFlipped([]); setLocked(false);
        }, 900);
      }
    }
  }, [locked, won, lost, cards, flipped, running, combo, difficulty, theme, cfg.pairs, moves, timeLeft]);

  const matched = cards.filter(c => c.matched).length / 2;
  const progress = (matched / cfg.pairs) * 100;
  const bestKey = `${difficulty}_${theme}`;
  const timerColor = timeLeft <= 15 ? "#ff4d4d" : timeLeft <= 30 ? "#ffaa00" : "#00ffc8";

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0e",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "74px 16px 32px",
      fontFamily: "'DM Mono', monospace",
      position: "relative", overflow: "hidden",
    }}>
      {/* bg glow */}
      <div style={{
        position: "fixed", width: 700, height: 700, borderRadius: "50%",
        top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        background: "radial-gradient(circle, rgba(0,255,200,0.03) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* Combo Toast */}
      {showCombo && combo >= 2 && (
        <div style={{
          position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #00ffc8, #00c8ff)",
          color: "#000", padding: "10px 24px", borderRadius: 40,
          fontWeight: 700, fontSize: 14, letterSpacing: 2, zIndex: 500,
          animation: "comboPopIn 0.3s ease",
          boxShadow: "0 0 30px rgba(0,255,200,0.5)",
        }}>
          {combo}× COMBO! 🔥
        </div>
      )}

      {/* Header */}
      <div style={{
        width: "100%", maxWidth: 680,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 16,
      }}>
        <div>
          <div style={{
            fontSize: 22, fontWeight: 700, color: "#fff",
            fontFamily: "'Syne', sans-serif", letterSpacing: 3,
          }}>MEMORY</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginTop: 2 }}>
            {matched}/{cfg.pairs} PAIRS · {moves} MOVES
          </div>
        </div>

        {/* Timer */}
        <div style={{
          textAlign: "center",
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${timerColor}44`,
          borderRadius: 12, padding: "8px 20px",
        }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 2 }}>TIME</div>
          <div style={{
            fontSize: 24, fontWeight: 700, color: timerColor,
            transition: "color 0.5s",
            animation: timeLeft <= 10 && running ? "pulse 0.8s infinite" : "none",
          }}>
            {String(Math.floor(timeLeft / 60)).padStart(2,"0")}:{String(Math.max(0, timeLeft % 60)).padStart(2,"0")}
          </div>
        </div>

        <button onClick={newGame} style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#fff", borderRadius: 10, padding: "8px 16px",
          cursor: "pointer", fontSize: 11, letterSpacing: 2,
          fontFamily: "'DM Mono', monospace", transition: "all 0.2s",
        }}
          onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
          onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
        >NEW ↺</button>
      </div>

      {/* Progress bar */}
      <div style={{
        width: "100%", maxWidth: 680, height: 3,
        background: "rgba(255,255,255,0.06)", borderRadius: 2, marginBottom: 16,
      }}>
        <div style={{
          height: "100%", borderRadius: 2,
          background: "linear-gradient(90deg, #00ffc8, #00c8ff)",
          width: `${progress}%`, transition: "width 0.4s ease",
          boxShadow: "0 0 10px rgba(0,255,200,0.6)",
        }} />
      </div>

      {/* Controls */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", justifyContent: "center",
      }}>
        {/* Difficulty */}
        <div style={{ display: "flex", gap: 4 }}>
          {Object.keys(GRID_CONFIGS).map(d => (
            <button key={d} onClick={() => setDifficulty(d)}
              disabled={running}
              style={{
                background: difficulty === d ? "rgba(0,255,200,0.12)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${difficulty === d ? "rgba(0,255,200,0.4)" : "rgba(255,255,255,0.08)"}`,
                color: difficulty === d ? "#00ffc8" : "rgba(255,255,255,0.4)",
                borderRadius: 8, padding: "5px 14px", cursor: running ? "not-allowed" : "pointer",
                fontSize: 10, letterSpacing: 1.5, fontFamily: "'DM Mono', monospace",
                textTransform: "uppercase", transition: "all 0.2s",
                opacity: running ? 0.5 : 1,
              }}>{d}</button>
          ))}
        </div>
        {/* Theme */}
        <div style={{ display: "flex", gap: 4 }}>
          {Object.keys(EMOJI_SETS).map(t => (
            <button key={t} onClick={() => setTheme(t)}
              disabled={running}
              style={{
                background: theme === t ? "rgba(226,255,93,0.1)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${theme === t ? "rgba(226,255,93,0.35)" : "rgba(255,255,255,0.08)"}`,
                color: theme === t ? "#e2ff5d" : "rgba(255,255,255,0.4)",
                borderRadius: 8, padding: "5px 14px", cursor: running ? "not-allowed" : "pointer",
                fontSize: 10, letterSpacing: 1.5, fontFamily: "'DM Mono', monospace",
                textTransform: "uppercase", transition: "all 0.2s",
                opacity: running ? 0.5 : 1,
              }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Best score */}
      {best[bestKey] && (
        <div style={{
          marginBottom: 14, fontSize: 10, letterSpacing: 2,
          color: "rgba(255,255,255,0.25)",
        }}>
          BEST SCORE: <span style={{ color: "#e2ff5d" }}>{best[bestKey]}</span>
        </div>
      )}

      {/* Card Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cfg.cols}, 1fr)`,
        gap: 10, maxWidth: 680, width: "100%",
      }}>
        {cards.map(card => (
          <Card
            key={card.id}
            card={card}
            onClick={() => flip(card.id)}
            celebrating={celebrating && card.matched}
          />
        ))}
      </div>

      {/* Win / Lose overlay */}
      {(won || lost) && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.75)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 300, animation: "fadeIn 0.3s ease",
        }}>
          <div style={{
            background: "#111116",
            border: `1px solid ${won ? "rgba(0,255,200,0.3)" : "rgba(255,77,77,0.3)"}`,
            borderRadius: 20, padding: "40px 48px", textAlign: "center",
            animation: "slideUp 0.35s ease",
            boxShadow: won ? "0 0 80px rgba(0,255,200,0.1)" : "0 0 80px rgba(255,77,77,0.1)",
          }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>{won ? "🎉" : "💀"}</div>
            <div style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: 28, letterSpacing: 3, color: "#fff", marginBottom: 8,
            }}>{won ? "YOU WIN!" : "TIME'S UP!"}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: 2, marginBottom: 24 }}>
              {won
                ? `${moves} MOVES · ${cfg.timeLimit - timeLeft}s · ${matched}/${cfg.pairs} PAIRS`
                : `${matched}/${cfg.pairs} PAIRS FOUND`}
            </div>
            {won && (
              <div style={{
                background: "rgba(0,255,200,0.08)",
                border: "1px solid rgba(0,255,200,0.2)",
                borderRadius: 10, padding: "12px 20px", marginBottom: 24,
              }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 4 }}>SCORE</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: "#00ffc8" }}>
                  {Math.round((cfg.pairs * 1000) / (moves + 1) + (timeLeft * 10))}
                </div>
              </div>
            )}
            <button onClick={newGame} style={{
              background: won
                ? "linear-gradient(135deg, #00ffc8, #00c8ff)"
                : "linear-gradient(135deg, #ff4d4d, #ff8800)",
              color: "#000", border: "none", borderRadius: 10,
              padding: "13px 36px", fontSize: 12, fontWeight: 700,
              cursor: "pointer", letterSpacing: 2,
              fontFamily: "'DM Mono', monospace",
              transition: "opacity 0.2s",
            }}
              onMouseOver={e => e.currentTarget.style.opacity = "0.85"}
              onMouseOut={e => e.currentTarget.style.opacity = "1"}
            >PLAY AGAIN</button>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes comboPopIn { 0%{transform:translateX(-50%) scale(0.7);opacity:0} 60%{transform:translateX(-50%) scale(1.1)} 100%{transform:translateX(-50%) scale(1);opacity:1} }
        @keyframes celebrate { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
      `}</style>
    </div>
  );
}

function Card({ card, onClick, celebrating }) {
  const [hover, setHover] = useState(false);
  const shown = card.flipped || card.matched;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        aspectRatio: "1",
        perspective: 600,
        cursor: shown ? "default" : "pointer",
        animation: celebrating ? "celebrate 0.4s ease" : "none",
      }}
    >
      <div style={{
        width: "100%", height: "100%",
        position: "relative",
        transformStyle: "preserve-3d",
        transform: shown ? "rotateY(180deg)" : "rotateY(0deg)",
        transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
      }}>
        {/* Back */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden",
          background: hover && !shown
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.04)",
          border: hover && !shown
            ? "1px solid rgba(0,255,200,0.3)"
            : "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s",
          boxShadow: hover && !shown ? "0 0 20px rgba(0,255,200,0.1)" : "none",
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
          }} />
        </div>

        {/* Front */}
        <div style={{
          position: "absolute", inset: 0,
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: card.matched
            ? "rgba(0,255,200,0.1)"
            : "rgba(255,255,255,0.06)",
          border: card.matched
            ? "1px solid rgba(0,255,200,0.35)"
            : "1px solid rgba(255,255,255,0.12)",
          borderRadius: 12,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "clamp(20px, 4vw, 32px)",
          boxShadow: card.matched ? "0 0 24px rgba(0,255,200,0.15)" : "none",
          transition: "all 0.3s",
        }}>
          {card.emoji}
        </div>
      </div>
    </div>
  );
}
