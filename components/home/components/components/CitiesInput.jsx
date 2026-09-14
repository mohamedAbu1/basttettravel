"use client";
import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { MdLocationCity } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaCheck } from "react-icons/fa";

const CitiesInput = ({ selectedCities, toggleCity, cities }) => {
  const { i18n } = useTranslation();
  const normalizedLang = i18n.language.split("-")[0]; // مثل en أو ar أو fr
  const { t } = useTranslation("home");

  return (
    <Popover.Root>
      {/* زر الإدخال */}
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-label={t("SelectCity")}
          className="booking-select-trigger"
        >
          <span className="booking-field-icon"><MdLocationCity aria-hidden="true" /></span>
          <span className="booking-select-copy">
            <small>{t("SelectCity")}</small>
            {(selectedCities || [])
              .map((c) => c.name?.[normalizedLang] || c.name?.["en"] || c.name)
              .join(" · ") || <strong>{t("SelectCity")}</strong>}
          </span>
          <FaChevronDown className="booking-select-chevron" aria-hidden="true" />
        </button>
      </Popover.Trigger>

      {/* محتوى الـ dropdown */}
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={8}
          collisionPadding={12}
          className="booking-options-popover"
        >
          <div className="booking-options-heading">{t("SelectCity")}</div>
          <div className="booking-options-list">
          {cities.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => toggleCity(city)}
              className={`booking-option ${(selectedCities || []).some((c) => c.id === city.id) ? "is-selected" : ""}`}
            >
              <span>{city.name?.[normalizedLang] || city.name?.["en"] || city.name}</span>
              {(selectedCities || []).some((c) => c.id === city.id) && <FaCheck aria-hidden="true" />}
            </button>
          ))}
          </div>

          {/* زر التأكيد */}
          <Popover.Close className="booking-options-confirm">
            {t("Confirm")}
          </Popover.Close>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default CitiesInput;
