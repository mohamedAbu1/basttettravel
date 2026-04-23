"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";

export default function Logo({ scrolled }) {
  const { themeName } = useTheme();
  const pathname = usePathname();

  const size = 250;
  const segments = pathname.split("/").filter(Boolean);

  const isHome =
    segments.length === 0 ||
    (segments.length === 1 &&
      ["en", "fr", "de", "it", "es", "pt"].includes(segments[0]));
  // ألوان حسب الثيم
  const goldColor = themeName === "dark" ? "#d4af37" : "#C9A34A";
  const textColor =
    themeName === "dark"
      ? "#FFFFFF"
      : !isHome
        ? "#1F2937"
        : scrolled
          ? "#1F2937"
          : "#fff";
  const subTextColor =
    themeName === "dark"
      ? "#9CA3AF"
      : !isHome
        ? "#6B7280"
        : scrolled
          ? "#6B7280"
          : "#fff";

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Link href="/" className="flex items-center gap-2">
        <svg
          width={size}
          height={(size * 260) / 800}
          viewBox="0 0 800 260"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* حرف W مع الطائرة */}
          <g transform="translate(40,40)">
            <path
              fill={goldColor}
              d="M0,0 L20,120 L45,60 L70,120 L95,60 L120,120 L140,0 L120,0 L100,80 L80,0 L60,80 L40,0 Z"
            />
            <path
              stroke={goldColor}
              d="M90,10 C150,-20 230,0 300,30"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path fill={goldColor} d="M300,30 l18,6 -8,2 -6,6 -4,-8 -8,-2 z" />
          </g>

          {/* نص Waset Travel */}
          <g transform="translate(220,85)">
            <text
              fill={textColor}
              fontFamily="Inter"
              fontWeight="700"
              fontSize="44"
            >
              Montu
            </text>
            <text
              fill={textColor}
              fontFamily="Inter"
              fontWeight="500"
              fontSize="34"
              y="42"
            >
              Travel
            </text>
          </g>

          {/* الرموز الفرعونية */}
          <g transform="translate(220,150)">
            {/* عين حورس */}
            <path
              stroke={goldColor}
              d="M0,15 C20,-5 60,-5 80,15 C60,35 20,35 0,15 Z"
              fill="none"
              strokeWidth="3"
            />
            <circle fill={goldColor} cx="40" cy="15" r="6" />
            <path
              stroke={goldColor}
              d="M10,30 C25,40 55,40 70,30"
              fill="none"
              strokeWidth="3"
            />

            {/* هرم */}
            <polygon fill={goldColor} points="100,30 130,0 160,30" />
            <rect fill={goldColor} x="100" y="35" width="60" height="4" />

            {/* صولجان واس */}
            <g transform="translate(200,0)">
              <path
                stroke={goldColor}
                d="M0,0 L0,30"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                fill={goldColor}
                d="M-6,-6 C-2,-18 8,-18 12,-6 C10,-2 6,2 0,2 C-4,0 -6,-2 -6,-6 Z"
              />
              <path
                stroke={goldColor}
                d="M10,-4 C16,-2 18,2 14,6"
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                stroke={goldColor}
                d="M-8,30 L0,68 L8,30"
                fill="none"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </g>
          </g>

          {/* وورد مارك */}
          <text
            x="40"
            y="210"
            fontFamily="Inter"
            fontWeight="500"
            fontSize="22"
            fill={subTextColor}
          >
            Wordmark Integration
          </text>
        </svg>
      </Link>
    </motion.div>
  );
}
