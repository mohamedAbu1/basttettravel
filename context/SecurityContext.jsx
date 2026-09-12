"use client";
import React, { createContext, useContext } from "react";

// دوال التحقق
const validateNotEmpty = (value) => {
  return value.trim().length > 0;
};

const validateEmail = (value) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value);
};

const SecurityContext = createContext();

export const SecurityProvider = ({ children }) => {
  const validateField = (fieldName, value) => {
    const normalizedField = String(fieldName).trim().toLowerCase();
    const normalizedValue = String(value || "").trim();
    if (!validateNotEmpty(value)) {
      return `${fieldName} cannot be empty`;
    }
    if (normalizedField.includes("password") && (normalizedValue.length < 8 || normalizedValue.length > 128)) {
      return "Password must be between 8 and 128 characters";
    }
    if (normalizedField.includes("email") && !validateEmail(normalizedValue)) {
      return "Invalid email format";
    }
    if (normalizedField.includes("name") && !/^[\p{L}\p{M}0-9\s.'-]+$/u.test(normalizedValue)) {
      return "Name contains unsupported characters";
    }
    return null; // لا يوجد خطأ
  };

  return (
    <SecurityContext.Provider value={{ validateField }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => useContext(SecurityContext);
