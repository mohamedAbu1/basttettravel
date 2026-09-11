"use client";

import { FaHeadset, FaMapMarkedAlt, FaShieldAlt, FaUserCheck } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

const benefits = [
  {
    icon: FaUserCheck,
    title: "Local expertise",
    text: "Travel with people who know Egypt beyond the guidebook.",
  },
  {
    icon: FaMapMarkedAlt,
    title: "Thoughtful itineraries",
    text: "Clear schedules designed around the places you want to experience.",
  },
  {
    icon: FaShieldAlt,
    title: "Clear booking",
    text: "See travelers, dates and pricing before you confirm your trip.",
  },
  {
    icon: FaHeadset,
    title: "Human support",
    text: "Our team is available to help you plan with confidence.",
  },
];

export default function TripBookingBenefits() {
  const { theme } = useTheme();

  return (
    <section className={theme.card + " rounded-2xl border border-[#d4b56f]/25 p-6 " + theme.text} aria-labelledby="booking-benefits-title">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4b56f]">The Basttet standard</p>
        <h2 id="booking-benefits-title" className="mt-2 text-2xl font-bold">Travel with confidence</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {benefits.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-xl border border-[#d4b56f]/15 bg-black/10 p-4">
            <Icon className="text-xl text-[#d4b56f]" aria-hidden="true" />
            <h3 className="mt-3 font-semibold">{title}</h3>
            <p className={"mt-1 text-sm leading-6 " + theme.subText}>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
