// BookingCalendar.jsx
import { useTheme } from "@/context/ThemeContext";
import React, { useState } from "react";
import CalendarBooking from "./components/CalendarBooking";
import BookingSummaryCard from "./components/BookingSummaryCard";
import { useChat } from "@/context/ChatContext";
import { useTranslation } from "react-i18next";

const BookingCalendar = ({ trip,id }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const prise = trip.solo_price;
  const { theme } = useTheme();
  const { t, i18n } = useTranslation("common");
  const labels = {
    en: { addPeople: "Add travelers to view available dates", addPeopleHint: "Select at least one adult or child to continue booking.", adults: "Adults", children: "Children" },
    de: { addPeople: "Fügen Sie Reisende hinzu, um verfügbare Termine zu sehen", addPeopleHint: "Wählen Sie mindestens einen Erwachsenen oder ein Kind aus.", adults: "Erwachsene", children: "Kinder" },
    es: { addPeople: "Añada viajeros para ver las fechas disponibles", addPeopleHint: "Seleccione al menos un adulto o niño para continuar.", adults: "Adultos", children: "Niños" },
    fr: { addPeople: "Ajoutez des voyageurs pour voir les dates disponibles", addPeopleHint: "Sélectionnez au moins un adulte ou un enfant pour continuer.", adults: "Adultes", children: "Enfants" },
    it: { addPeople: "Aggiungi viaggiatori per vedere le date disponibili", addPeopleHint: "Seleziona almeno un adulto o un bambino per continuare.", adults: "Adulti", children: "Bambini" },
    zh: { addPeople: "添加旅客以查看可用日期", addPeopleHint: "请选择至少一名成人或儿童以继续预订。", adults: "成人", children: "儿童" },
  }[i18n.language?.split("-")[0]] || {
    addPeople: "Add travelers to view available dates",
    addPeopleHint: "Select at least one adult or child to continue booking.",
    adults: "Adults",
    children: "Children",
  };
  const {
    participants,
    setParticipants,
    childrenCount,
    setChildrenCount,
    checkInPrice,
    setCheckInPrice,
    checkIn,
    setCheckIn,
    checkOut,
    setCheckOut,
  } = useChat();

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };

  return (
    <div className={` w-full h-fit rounded-2xl border border-[#d4b56f]/30 p-5 shadow-xl font-sans`}>
      {/* Participants Section */}
      <h2 className={`${theme.title} mb-4`}>{t("participants")}</h2>

      <div className="flex flex-col lg:flex-row gap-3 lg:gap-0 justify-between mb-6">
        {/* Adults */}
        <div className="flex items-center space-x-1">
          <div>
            <p className={theme.heading}>{labels.adults}</p>
            <p className={theme.subText}>{t("age6to100")}</p>
          </div>
          <div className="flex items-center ml-3 lg:ml-0 space-x-2">
            <button
              aria-label="Decrease adults"
              onClick={() => setParticipants(Math.max(0, participants - 1))}
              className={`hero-secondary-action2`}
              disabled={participants === 0}
            >
              -
            </button>
            <span className={theme.text}>{participants}</span>
            <button
              aria-label="Increase adults"
              onClick={() => setParticipants(participants + 1)}
              className={`hero-primary-action2`}
            >
              +
            </button>
          </div>
        </div>

        {/* Children */}
        <div className="flex items-center space-x-1">
          <div>
            <p className={theme.heading}>{labels.children}</p>
            <p className={theme.subText}>{t("age6to12")}</p>
          </div>
          <div className="flex items-center ml-5 lg:ml-0 space-x-2">
            <button
              aria-label="Decrease children"
              onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
              className={`hero-secondary-action2`}
              disabled={childrenCount === 0}
            >
              -
            </button>
            <span className={theme.text}>{childrenCount}</span>
            <button
              aria-label="Increase children"
              onClick={() => setChildrenCount(childrenCount + 1)}
              className={`hero-primary-action2`}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Section OR Message */}
      {participants + childrenCount === 0 ? (
        <div className="text-center py-10">
          <p className={`${theme.heading} text-lg`}>
            {labels.addPeople}
          </p>
          <p className={theme.subText}>
            {labels.addPeopleHint}
          </p>
        </div>
      ) : (
        <CalendarBooking
          prise={prise}
          checkInPrice={checkInPrice}
          setCheckInPrice={setCheckInPrice}
          setCheckOut={setCheckOut}
          checkOut={checkOut}
          checkIn={checkIn}
          setCheckIn={setCheckIn}
          tripId={id}
        />
      )}

      <BookingSummaryCard
        tourName={trip.title?.[i18n.language?.split("-")[0]] || trip.title?.en || "Trip booking"}
        checkInPrice={checkInPrice}
        participants={participants}
        childrenCount={childrenCount}
        checkOut={checkOut}
        checkIn={checkIn}
        tripId={id}
      />
    </div>
  );
};

export default BookingCalendar;
