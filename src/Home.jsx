import React from "react";

export default function Home({ setPage }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0e",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Syne', sans-serif",
      padding: "80px 20px 40px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", width: 600, height: 600,
        borderRadius: "50%", top: -200, left: -150,
        background: "radial-gradient(circle, rgba(226,255,93,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", width: 500, height: 500,
        borderRadius: "50%", bottom: -100, right: -100,
        background: "radial-gradient(circle, rgba(0,255,200,0.05) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ textAlign: "center", maxWidth: 640, position: "relative" }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11, letterSpacing: 4,
          color: "#e2ff5d", marginBottom: 20, opacity: 0.8,
        }}>— WORD GAMES COLLECTION —</div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800, fontSize: "clamp(48px, 8vw, 86px)",
          margin: "0 0 16px", lineHeight: 1,
          background: "linear-gradient(90deg, #e2ff5d, #00ffc8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: -2,
        }}>WORDLAB</h1>

        <p style={{
          fontFamily: "'DM Mono', monospace",
          color: "rgba(255,255,255,0.4)",
          fontSize: 14, lineHeight: 1.8,
          marginBottom: 52, letterSpacing: 0.3,
        }}>
          Two games. One place. Challenge your brain<br />
          with words and memory every day.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16, marginBottom: 40,
        }}>
          <GameCard
            emoji="🟩" title="WORDLE"
            desc="Guess the 5-letter word in 6 tries. Daily challenge + practice mode."
            accent="#e2ff5d" onClick={() => setPage("wordle")}
            tags={["Daily", "Hard Mode", "Stats"]}
          />
          <GameCard
            emoji="🃏" title="MEMORY"
            desc="Flip cards to find matching pairs. Beat the clock and your best score."
            accent="#00ffc8" onClick={() => setPage("memory")}
            tags={["Timed", "Grid Sizes", "Best Score"]}
          />
        </div>

        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: 2,
        }}>MORE GAMES COMING SOON</div>
      </div>
    </div>
  );
}

function GameCard({ emoji, title, desc, accent, onClick, tags }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? accent + "55" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 16, padding: "28px 24px", cursor: "pointer",
        transition: "all 0.25s ease", textAlign: "left",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 20px 60px ${accent}15` : "none",
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 14 }}>{emoji}</div>
      <div style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20,
        color: "#fff", letterSpacing: 2, marginBottom: 8,
      }}>{title}</div>
      <div style={{
        fontFamily: "'DM Mono', monospace", fontSize: 12,
        color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 18,
      }}>{desc}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {tags.map(t => (
          <span key={t} style={{
            fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1.5,
            color: accent, background: accent + "15",
            border: `1px solid ${accent}30`, borderRadius: 4, padding: "3px 8px",
          }}>{t}</span>
        ))}
      </div>
      <div style={{
        marginTop: 20, fontFamily: "'DM Mono', monospace",
        fontSize: 11, color: accent, letterSpacing: 2,
        opacity: hovered ? 1 : 0.5, transition: "opacity 0.2s",
      }}>PLAY NOW →</div>
    </div>
  );
}
