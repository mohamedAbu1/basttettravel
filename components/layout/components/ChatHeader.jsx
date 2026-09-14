"use client";
import { useTranslation } from "react-i18next";
import { FaHeadset, FaTimes } from "react-icons/fa";

export default function ChatHeader({ onClose }) {
    const { t } = useTranslation("home");
  
  return (
    <div className="chat-panel-header">
      <div className="chat-brand-lockup">
        <span className="chat-brand-icon"><FaHeadset aria-hidden="true" /></span>
        <span>
          <strong>Basttet Travel</strong>
          <small>{t("Support")}</small>
        </span>
      </div>
      <button type="button" onClick={onClose} aria-label="Close chat" className="chat-close-button">
        <FaTimes aria-hidden="true" />
      </button>
    </div>
  );
}
