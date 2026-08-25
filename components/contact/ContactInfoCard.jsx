import { motion } from "framer-motion";
import Image from "next/image";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import DividerWithIcon from "../layout/DividerWithIcon";

export default function ContactInfoCard({ themeName, t }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`card-theme relative rounded-2xl p-8 shadow-xl ${
        themeName === "dark" ? "card-dark" : "card-light"
      }`}
    >
      <div className="hidden lg:flex absolute top-80 left-0 w-full h-[450px] opacity-50 pointer-events-none">
        <Image
          src={
            themeName === "dark"
              ? "/HomePageImage/egyptian-pyramids-sphinx-pop-up-book.webp"
              : "/HomePageImage/1547933741.svg"
          }
          alt="Decorative Background"
          fill
          className="object-contain"
        />
      </div>
      <h2 className={`contact-p text-3xl font-bold mb-6 text-gradient ${
        themeName === "dark" ? "text-stroke-dark" : "text-stroke-light"
      }`}>
        {t("h1")}
      </h2>

      <DividerWithIcon />

      <p className="mb-6 opacity-80">{t("p1")}</p>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <FaPhoneAlt className="icon-theme" />
          <span>+201100507802</span>
        </div>
        <div className="flex items-center gap-3">
          <FaEnvelope className="icon-theme" />
          <span>BasttetTravel@outlook.com</span>
        </div>
        <div className="flex items-center gap-3">
          <FaMapMarkerAlt className="icon-theme" />
          <span>{t("sp")}</span>
        </div>
      </div>
    </motion.div>
  );
}
