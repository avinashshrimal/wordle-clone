import React from "react";

export default function Nav({ page, setPage }) {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: "rgba(10,10,14,0.85)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", height: 58,
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800, fontSize: 18,
          letterSpacing: 3,
          background: "linear-gradient(90deg, #e2ff5d, #00ffc8)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          WORDLAB
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { id: "home", label: "Home" },
            { id: "wordle", label: "Wordle" },
            { id: "memory", label: "Memory" },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setPage(id)}
              style={{
                background: page === id
                  ? "rgba(226,255,93,0.1)"
                  : "transparent",
                border: page === id
                  ? "1px solid rgba(226,255,93,0.3)"
                  : "1px solid transparent",
                color: page === id ? "#e2ff5d" : "rgba(255,255,255,0.45)",
                borderRadius: 8,
                padding: "6px 16px",
                fontSize: 12,
                fontFamily: "'DM Mono', monospace",
                fontWeight: 500,
                letterSpacing: 1.5,
                cursor: "pointer",
                textTransform: "uppercase",
                transition: "all 0.2s ease",
              }}
              onMouseOver={e => {
                if (page !== id) e.currentTarget.style.color = "rgba(255,255,255,0.8)";
              }}
              onMouseOut={e => {
                if (page !== id) e.currentTarget.style.color = "rgba(255,255,255,0.45)";
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
