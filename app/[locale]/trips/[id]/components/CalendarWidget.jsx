// BookingCalendar.jsx
import { useTheme } from "@/context/ThemeContext";
import React, { useState } from "react";
import CalendarBooking from "./components/CalendarBooking";
import BookingSummaryCard from "./components/BookingSummaryCard";
import { useChat } from "@/context/ChatContext";

const BookingCalendar = ({ trip,id }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const prise = trip.solo_price;
  const { theme } = useTheme();
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
    <div className={`${theme.card} w-1/2 h-fit p-6 shadow-lg font-sans`}>
      {/* Participants Section */}
      <h2 className={`${theme.title} mb-4`}>Participants</h2>

      <div className="flex justify-between mb-6">
        {/* Adults */}
        <div className="flex items-center space-x-1">
          <div>
            <p className={theme.heading}>Adult</p>
            <p className={theme.subText}>Age 6 - 100</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setParticipants(Math.max(0, participants - 1))}
              className={`${theme.buttonSecondary}`}
              disabled={participants === 0}
            >
              -
            </button>
            <span className={theme.text}>{participants}</span>
            <button
              onClick={() => setParticipants(participants + 1)}
              className={`${theme.buttonPrimary}`}
            >
              +
            </button>
          </div>
        </div>

        {/* Children */}
        <div className="flex items-center space-x-1">
          <div>
            <p className={theme.heading}>Child</p>
            <p className={theme.subText}>Age 6 - 12</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
              className={`${theme.buttonSecondary}`}
              disabled={childrenCount === 0}
            >
              -
            </button>
            <span className={theme.text}>{childrenCount}</span>
            <button
              onClick={() => setChildrenCount(childrenCount + 1)}
              className={`${theme.buttonPrimary}`}
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
            Please add participants to view available dates
          </p>
          <p className={theme.subText}>
            Select the number of adults or children to continue booking.
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
        />
      )}

      <BookingSummaryCard
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
