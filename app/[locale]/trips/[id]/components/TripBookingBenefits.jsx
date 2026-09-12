"use client";

import { FaHeadset, FaMapMarkedAlt, FaShieldAlt, FaUserCheck } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

const benefits = {
  en: { eyebrow: "The Basttet standard", title: "Travel with confidence", items: [["Local expertise", "Travel with people who know Egypt beyond the guidebook."], ["Thoughtful itineraries", "Clear schedules designed around the places you want to experience."], ["Clear booking", "See travelers, dates and pricing before you confirm your trip."], ["Human support", "Our team is available to help you plan with confidence."]] },
  de: { eyebrow: "Der Basttet-Standard", title: "Mit Vertrauen reisen", items: [["Lokale Expertise", "Reisen Sie mit Menschen, die Ägypten wirklich kennen."], ["Durchdachte Routen", "Klare Programme für die Orte, die Sie erleben möchten."], ["Transparente Buchung", "Sehen Sie Reisende, Termine und Preise vor der Bestätigung."], ["Persönliche Unterstützung", "Unser Team hilft Ihnen bei der sicheren Planung."]] },
  es: { eyebrow: "El estándar Basttet", title: "Viaja con confianza", items: [["Experiencia local", "Viaja con personas que conocen Egipto de verdad."], ["Itinerarios pensados", "Programas claros para los lugares que quieres descubrir."], ["Reserva clara", "Consulta viajeros, fechas y precios antes de confirmar."], ["Atención humana", "Nuestro equipo te ayuda a planificar con confianza."]] },
  fr: { eyebrow: "Le standard Basttet", title: "Voyagez en toute confiance", items: [["Expertise locale", "Voyagez avec des personnes qui connaissent vraiment l'Égypte."], ["Itinéraires soignés", "Des programmes clairs pour les lieux que vous souhaitez découvrir."], ["Réservation claire", "Consultez voyageurs, dates et prix avant de confirmer."], ["Assistance humaine", "Notre équipe vous aide à planifier sereinement."]] },
  it: { eyebrow: "Lo standard Basttet", title: "Viaggia con fiducia", items: [["Esperienza locale", "Viaggia con persone che conoscono davvero l'Egitto."], ["Itinerari curati", "Programmi chiari per i luoghi che desideri scoprire."], ["Prenotazione chiara", "Visualizza partecipanti, date e prezzi prima di confermare."], ["Supporto umano", "Il nostro team ti aiuta a pianificare con sicurezza."]] },
  zh: { eyebrow: "Basttet 标准", title: "安心出行", items: [["当地经验", "与真正了解埃及的人一起旅行。"], ["精心安排的行程", "清晰的行程安排，带您探索心仪之地。"], ["透明预订", "确认前即可查看人数、日期和价格。"], ["人工支持", "我们的团队将帮助您安心规划。"]] },
};

export default function TripBookingBenefits() {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const content = benefits[i18n.language?.split("-")[0]] || benefits.en;

  return (
    <section className={ " rounded-2xl border border-[#d4b56f]/25 p-6 " + theme.text} aria-labelledby="booking-benefits-title">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4b56f]">{content.eyebrow}</p>
        <h2 id="booking-benefits-title" className="mt-2 text-2xl font-bold">{content.title}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {content.items.map(([title, text], index) => {
          const Icon = [FaUserCheck, FaMapMarkedAlt, FaShieldAlt, FaHeadset][index];
          return (
          <div key={title} className="rounded-xl border border-[#d4b56f]/15 bg-black/10 p-4">
            <Icon className="text-xl text-[#d4b56f]" aria-hidden="true" />
            <h3 className="mt-3 font-semibold">{title}</h3>
            <p className={"mt-1 text-sm leading-6 " + theme.subText}>{text}</p>
          </div>
          );
        })}
      </div>
    </section>
  );
}
