import React from "react";

export default function HeaderComponent({ theme }) {
  return (
    <div className="text-center py-8">
      <h1
        className="text-4xl font-extrabold tracking-wide text-center"
        style={{
          background: "linear-gradient(to right, #c9a34a, #b9972f)", // ✅ مباشرة
          WebkitBackgroundClip: "text",
        }}
      >
        Basttet Travel
      </h1>
    </div>
  );
}
