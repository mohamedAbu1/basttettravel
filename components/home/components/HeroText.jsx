"use client";
import { Typewriter } from "react-simple-typewriter";
import { useTheme } from "@/context/ThemeContext";

export default function HeroText() {
  const { theme } = useTheme();

  return (
    <h1
      className="hero-text absolute bottom-6 text-center font-extrabold text-4xl md:text-5xl text-gradient"
      style={{
        filter: `drop-shadow(0 0 6px ${theme.logoBorder})`,
      }}
    >
      <Typewriter
        words={["Welcome to", "𓂀 Basttet travel 𓂀", "Enjoy the Journey"]}
        loop={true}
        cursor
        cursorStyle="𓂀"
        typeSpeed={75}
        deleteSpeed={40}
        delaySpeed={2000}
      />
    </h1>
  );
}
