"use client";
import { Box, Button, StyledEngineProvider } from "@mui/material";
import { useTheme } from "@/context/ThemeContext";
import { useData } from "@/context/DataContext";
import React from "react";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import CalendarClient from "./CalendarWrapper";
import CitySelect from "./CitySelect";
import CategorySelect from "./CategorySelect";
import PriceSelect from "./PriceSelect";
import { useRouter } from "next/navigation";

const Content = () => {
  const { theme } = useTheme();
  const { setCity, city, setPrice, price, tripType, setTripType } = useData();

  const { i18n, t } = useTranslation("home");
  const currentLang = i18n.language || "en";
  const { cities: allCities, categories: allCategories } =
    useCitiesCategories();

  const router = useRouter();

  const isFormValid = city && price && tripType;
  const handleSearch = () => {
    // نبني الكويري مباشرة من القيم الحالية في الانبوتات
    const queryObj = {
      city: [city],
      category: [tripType],
      price: price,
      popular: false,
    };

    const encoded = btoa(JSON.stringify(queryObj));

    // التحويل إلى صفحة الرحلات مع الكويري الجديد
    router.push(`/trips?data=${encoded}`);
  };

  return (
    <div className="hidden md:flex flex-col items-center justify-center text-center px-6 z-30">
      <div className="w-[70%]">
        {/* Company Name */}
        <h1
          className={theme.title}
          style={{ fontSize: "4.4rem", opacity: "0" }}
        >
          WasetTravel
        </h1>

        <p
          className={`text-xl md:text-2xl mt-6 leading-relaxed ${theme.subText} animate-slideUp`}
        ></p>

        {/* Trip Filter Form */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(5, 1fr)" },
            gap: 2,
            mt: 6,
            p: 3,
            borderRadius: 8,
            backdropFilter: "blur(4px)",
            // backgroundImage: "linear-gradient(145deg, #3F3228, #2A1F18, #4A3B2A)", // خلفية حجرية داكنة
            // border: "2px solid #E5D3A1", // حدود ذهبية
            boxShadow: `
      inset 2px 2px 6px rgba(0,0,0,1.6),
      4px 4px 12px rgba(0,0,0,1.8)
    `,
            color: "#E5D3A1", // لون نص بيج ذهبي
          }}
        >
          {/* Inputs Filter */}
          <CitySelect
            allCities={allCities}
            currentLang={currentLang}
            city={city}
            setCity={setCity}
            t={t}
            theme={theme}
          />

          <CategorySelect
            allCategories={allCategories}
            currentLang={currentLang}
            tripType={tripType}
            setTripType={setTripType}
            t={t}
          />

          <PriceSelect price={price} setPrice={setPrice} t={t} theme={theme} />

          {/* Calendar */}
          <StyledEngineProvider injectFirst>
            <CalendarClient />
          </StyledEngineProvider>

          {/* Search Button */}
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={!isFormValid}
            sx={{
              backgroundImage: "linear-gradient(180deg, #C2A878, #A68B5B)", // زر بلون حجري ذهبي
              color: "#fff",
              fontWeight: "700",
              borderRadius: "8px",
              px: 4,
              py: 1.5,
              textTransform: "uppercase",
              boxShadow: `
        inset 1px 1px 3px rgba(0,0,0,0.5),
        0 4px 10px rgba(0,0,0,0.6)
      `,
              "&:hover": {
                backgroundImage: "linear-gradient(180deg, #A68B5B, #8C7C5A)",
                boxShadow: `
          inset 2px 2px 4px rgba(0,0,0,0.7),
          0 6px 14px rgba(0,0,0,0.8)
        `,
              },
            }}
          >
            {t("Search")}
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default Content;
