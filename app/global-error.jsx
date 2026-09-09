"use client";

/** Root fallback that does not depend on the provider tree that may have failed. */
export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px", color: "#E6DCCF", background: "radial-gradient(circle at top, #3F3228 0%, #121212 55%)", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
        <main>
          <div style={{ fontSize: "4rem", color: "#C2A878" }}>𓂀</div>
          <p style={{ letterSpacing: "0.25em", color: "#C2A878" }}>500</p>
          <h1>Something went wrong</h1>
          <p style={{ opacity: 0.75 }}>Please try again or return to the home page.</p>
          <button type="button" onClick={() => reset()} style={{ marginTop: "20px", padding: "12px 22px", border: "1px solid #C2A878", borderRadius: "12px", color: "#121212", background: "#C2A878", cursor: "pointer", fontWeight: 700 }}>Try again</button>
        </main>
      </body>
    </html>
  );
}
