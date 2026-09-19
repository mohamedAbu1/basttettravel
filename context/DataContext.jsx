/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { createContext, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
// ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
const DataContext = createContext();
const addDays = (date, amount) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
};
// ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
export function DataProvider({ children }) {
    const { i18n, t } = useTranslation("home");

  const [city, setCity] = useState(t("Luxor"));
  const [price, setPrice] = useState("Economy");
  const [tripType, setTripType] = useState(t("OneDayTrips"));
  const [arrival, setArrival] = useState(addDays(new Date(), 2));
  const [departure, setDeparture] = useState(addDays(new Date(), 9));
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const handleLoginOpen = () => {setLoginOpen(true) ,setSignUpOpen(false)};
  const handleSignUpOpen = () => {setSignUpOpen(true) ,setLoginOpen(false)};
  const handleLoginClose = () => setLoginOpen(false);
  const handleSignUpClose = () => setSignUpOpen(false);
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  const handleSearch = () => {
    console.log({ city, price, tripType, arrival, departure });
  };
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  const specialDatesBase = [
    {
      date: new Date(2026, 11, 25),
      type: "Holiday",
      iconType: "celebration",
      discount: 0.3,
    },
    {
      date: new Date(2026, 0, 1),
      type: "Newyear",
      iconType: "star",
      discount: 0.2,
    },
  ];
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  const specialDates = specialDatesBase;
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  // Kept for backwards compatibility with older calendar consumers. The
  // public booking calendar now renders its own lightweight date controls.
  const DayWithIcon = ({ children }) => children || null;
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  return (
    <DataContext.Provider
      value={{
        city,
        setCity,
        addDays,
        price,
        setPrice,
        tripType,
        setTripType,
        arrival,
        setArrival,
        departure,
        setDeparture,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        handleSearch,
        specialDates,
        DayWithIcon,
        images: [],
        setImages: () => {},
        index: 0,
        loginOpen,
        setLoginOpen,
        signUpOpen,
        setSignUpOpen,
        handleLoginClose,
        handleLoginOpen,
        handleSignUpOpen,
        handleSignUpClose,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
