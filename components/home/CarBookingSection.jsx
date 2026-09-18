"use client";

import Image from "next/image";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCalendarAlt, FaCarSide, FaClock, FaMapMarkerAlt, FaPhone, FaTimes, FaUserFriends, FaWhatsapp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import DividerWithIcon from "../layout/DividerWithIcon";

const WHATSAPP_NUMBER = "201100507802";

const initialForm = {
  name: "",
  phone: "",
  pickup: "",
  dropoff: "",
  date: "",
  time: "",
  passengers: "1",
  vehicle: "Sedan",
  notes: "",
};

export default function CarBookingSection() {
  const { theme, themeName } = useTheme();
  const { t } = useTranslation("home");
  const { userData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  const openBooking = () => {
    setForm((previous) => ({
      ...previous,
      name: previous.name || userData?.name || "",
      phone: previous.phone || userData?.phone || "",
    }));
    setIsOpen(true);
  };

  const updateField = (field, value) => setForm((previous) => ({ ...previous, [field]: value }));

  const submitBooking = (event) => {
    event.preventDefault();
    const message = [
      "Hello Basttet Travel, I would like to book a private car transfer.",
      "",
      `Name: ${form.name}`,
      `Phone: ${form.phone || "Not provided"}`,
      `Pickup: ${form.pickup}`,
      `Drop-off: ${form.dropoff}`,
      `Date: ${form.date}`,
      `Time: ${form.time}`,
      `Passengers: ${form.passengers}`,
      `Vehicle: ${form.vehicle}`,
      `Notes: ${form.notes || "None"}`,
      "",
      "Please confirm availability and the final price. Thank you.",
    ].join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return <>
    <motion.section initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} className={`car-transfer-section ${themeName === "dark" ? "is-dark" : "is-light"}`}>
      <div className="car-transfer-glow" />
      <div className="car-transfer-shell">
        <div className="car-transfer-visual"><div className="car-transfer-image-frame"><Image src={themeName === "dark" ? "/HomePageImage/20752-5-2014-hyundai-tucson.webp" : "/HomePageImage/White-Kia-PNG-High-Quality-Image.webp"} alt="Private car transfer" fill sizes="(max-width: 900px) 100vw, 48vw" className="car-transfer-image" /></div><span className="car-transfer-visual-badge"><FaCarSide /> Private transfer</span></div>
        <div className="car-transfer-copy"><span className="car-transfer-eyebrow">Basttet Travel · Door to door</span><h2>{t("PremiumCarTransfer")}</h2><DividerWithIcon /><p>{t("Experience")}</p>{userData && userData.role !== "ADMIN" ? <button type="button" onClick={openBooking} className="car-transfer-button"><FaWhatsapp /> Book your transfer <span>→</span></button> : <p className="car-transfer-login-note">{t("LoginBookCar")}</p>}</div>
      </div>
    </motion.section>

    <AnimatePresence>{isOpen && <motion.div className="car-booking-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false); }}><motion.div role="dialog" aria-modal="true" aria-labelledby="car-booking-title" className="car-booking-modal" initial={{ opacity: 0, y: 20, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: .98 }}><div className="car-booking-modal-header"><div><span className="car-transfer-eyebrow">WhatsApp concierge</span><h2 id="car-booking-title">Plan your private transfer</h2><p>Share the details and our team will confirm availability on WhatsApp.</p></div><button type="button" className="car-booking-close" onClick={() => setIsOpen(false)} aria-label="Close booking form"><FaTimes /></button></div><form onSubmit={submitBooking}><div className="car-booking-form-grid"><label><span>Your name *</span><div className="car-booking-input"><FaCarSide /><input required value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Full name" /></div></label><label><span>Phone number <small>(recommended)</small></span><div className="car-booking-input"><FaPhone /><input type="tel" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="+20 ..." /></div></label><label><span>Pickup location *</span><div className="car-booking-input"><FaMapMarkerAlt /><input required value={form.pickup} onChange={(event) => updateField("pickup", event.target.value)} placeholder="Hotel, airport or address" /></div></label><label><span>Drop-off location *</span><div className="car-booking-input"><FaMapMarkerAlt /><input required value={form.dropoff} onChange={(event) => updateField("dropoff", event.target.value)} placeholder="Where are you going?" /></div></label><label><span>Date *</span><div className="car-booking-input"><FaCalendarAlt /><input required type="date" min={new Date().toISOString().split("T")[0]} value={form.date} onChange={(event) => updateField("date", event.target.value)} /></div></label><label><span>Pickup time *</span><div className="car-booking-input"><FaClock /><input required type="time" value={form.time} onChange={(event) => updateField("time", event.target.value)} /></div></label><label><span>Passengers *</span><div className="car-booking-input"><FaUserFriends /><input required min="1" max="30" type="number" value={form.passengers} onChange={(event) => updateField("passengers", event.target.value)} /></div></label><label><span>Vehicle type *</span><div className="car-booking-input"><FaCarSide /><select value={form.vehicle} onChange={(event) => updateField("vehicle", event.target.value)}><option>Sedan</option><option>SUV</option><option>Van</option><option>Luxury car</option></select></div></label></div><label className="car-booking-notes"><span>Extra notes <small>(optional)</small></span><textarea rows="3" value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Flight number, luggage, child seat or special request" /></label><button type="submit" className="car-booking-submit"><FaWhatsapp /> Continue to WhatsApp</button><p className="car-booking-privacy">Your details are placed in the WhatsApp message only. No phone number is required to open the chat.</p></form></motion.div></motion.div>}</AnimatePresence>
  </>;
}
