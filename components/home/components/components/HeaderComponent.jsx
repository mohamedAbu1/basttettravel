import React from "react";

export default function HeaderComponent({ isDark }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 0 20px" }}>
      <h1
        style={{
          fontFamily: "Cinzel, serif",
          fontSize: "46px",
          fontWeight: "700",
          letterSpacing: "4px",
          textTransform: "uppercase",
          background: "linear-gradient(to right, #c9a34a, #b9972f)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        WasetTravel
      </h1>
    </div>
  );
}
