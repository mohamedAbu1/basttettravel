"use client";
import Typewriter from "typewriter-effect";

export default function HeroText() {
  return (
    <h1 className="hero-text absolute bottom-6">
      <Typewriter
        options={{
          strings: ["Welcome to","𓂀 MontuTravel 𓂀", "Enjoy the Journey"],
          autoStart: true,
          loop: true,
        }}
      />
    </h1>
  );
}
