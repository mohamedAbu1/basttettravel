"use client";
import React from "react";
import { TextField, MenuItem, InputAdornment } from "@mui/material";
import { FaCity } from "react-icons/fa";

export default function CitySelect({
  allCities,
  currentLang,
  city,
  setCity,
  t,
  theme,
}) {
  return (
    <TextField
      select
      label={t("SelectCity")}
      value={city}
      onChange={(e) => setCity(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FaCity
              className={theme.icon}
              style={{
                paddingLeft: "15px",
                color: "#C9A34A",
                fontSize: "35px",
              }}
            />
          </InputAdornment>
        ),
      }}
      sx={{
        borderRadius: 3,
        "& .MuiOutlinedInput-root": {
          padding: "5px",
          color: "#2C2C2C",
          fontWeight: "800",
          letterSpacing: "0.5px",
          transition: "all 0.3s ease",
          "& fieldset": {
            borderColor: "#C9A34A",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
          },
          "&:hover fieldset": {
            borderColor: "#B9972F",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#B9972F",
            boxShadow: "0 0 0 2px rgba(201,163,74,0.25)",
          },
        },
        "& .MuiInputLabel-root": {
          color: "#C9A34A",
          fontWeight: "600",
          letterSpacing: "0.4px",
        },
        "& .MuiInputBase-input": {
          color: "#C9A34A",
          padding: "12px 14px",
        },
        "& .MuiMenuItem-root": {
          fontWeight: "500",
          color: "#2C2C2C",
          borderRadius: "8px",
          margin: "4px 8px",
          padding: "10px 14px",
          transition: "all 0.3s ease",
          "&:hover": {
            background: "linear-gradient(to right, #FFF3E0, #FFE0B2)",
            color: "#B9972F",
            transform: "scale(1.02)",
          },
          "&.Mui-selected": {
            background: "linear-gradient(to right, #C9A34A, #B9972F)",
            color: "#fff",
            fontWeight: "600",
          },
          "&.Mui-selected:hover": {
            background: "linear-gradient(to right, #B9972F, #A67C00)",
          },
        },
      }}
    >
      {allCities.map((c) => {
        const cityName = c.name?.[currentLang] || c.name?.["en"] || c.name;
        return (
          <MenuItem key={c.id} value={cityName}>
            {cityName}
          </MenuItem>
        );
      })}
    </TextField>
  );
}
