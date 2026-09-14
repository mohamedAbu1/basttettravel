"use client";
import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { MdCategory } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaCheck } from "react-icons/fa";

const CategoriesInput = ({ selectedCategories, toggleCategory, categories }) => {
 const { i18n } = useTranslation();
  const normalizedLang = i18n.language.split("-")[0]; // مثل en أو ar أو fr
  const { t } = useTranslation("home");
  return (
    <div className="relative w-full">
      <Popover.Root>
        {/* زر الإدخال */}
        <Popover.Trigger asChild>
          <button
            type="button"
            aria-label={t("SelectCategory")}
            className="booking-select-trigger"
          >
            <span className="booking-field-icon"><MdCategory aria-hidden="true" /></span>
            <span className="booking-select-copy">
              <small>{t("SelectCategory")}</small>
              {(selectedCategories || [])
                .map((c) => c.name?.[normalizedLang] || c.name?.["en"] || c.name)
                .join(" · ") || <strong>{t("SelectCategory")}</strong>}
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
            <div className="booking-options-heading">{t("SelectCategory")}</div>
            <div className="booking-options-list">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  toggleCategory(cat);
                }}
                className={`booking-option ${(selectedCategories || []).some((c) => c.id === cat.id) ? "is-selected" : ""}`}
              >
                <span>{cat.name?.[normalizedLang] || cat.name?.["en"] || cat.displayName || cat.name}</span>
                {(selectedCategories || []).some((c) => c.id === cat.id) && <FaCheck aria-hidden="true" />}
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
    </div>
  );
};

export default CategoriesInput;
