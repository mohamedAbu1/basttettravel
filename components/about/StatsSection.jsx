"use client";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

export default function StatsSection() {
  const { themeName } = useTheme();
  const { t } = useTranslation("about");

  const stats = [
    { label: t("label"), value: 10 },
    { label: t("label2"), value: 25000 },
    { label: t("label3"), value: 120 },
    { label: t("label4"), value: 60 },
  ];

  return (
    <section className="relative z-10 py-14 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <AnimatedStat key={i} stat={stat} themeName={themeName} />
        ))}
      </div>
    </section>
  );
}

function AnimatedStat({ stat, themeName }) {
  const controls = useAnimation();
  const [count, setCount] = useState(0);

  useEffect(() => {
    controls.start({
      count: stat.value,
      transition: { duration: 2, ease: "easeOut" },
    });
  }, [stat.value, controls]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="about-stat-card"
    >
      <motion.div
        animate={controls}
        initial={{ count: 0 }}
        onUpdate={(latest) => setCount(Math.floor(latest.count))}
        className="about-stat-value"
      >
        {count}+
      </motion.div>
      <div
        className="about-stat-label"
      >
        {stat.label}
      </div>
    </motion.div>
  );
}
