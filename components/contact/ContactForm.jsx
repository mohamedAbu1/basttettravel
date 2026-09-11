import { motion } from "framer-motion";
import DividerWithIcon from "../layout/DividerWithIcon";

export default function ContactForm({ themeName, t, userData, formData, handleChange, handleSubmit, isSubmitting }) {
  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className={`card-theme rounded-2xl p-8 shadow-xl space-y-6 ${
        themeName === "dark" ? "card-dark" : "card-light"
      }`}
    >
      <h2
        className={`contact-p text-3xl font-bold mb-6 text-gradient ${
          themeName === "dark" ? "text-stroke-dark" : "text-stroke-light"
        }`}
      >
        {t("h2")}
      </h2>

      <DividerWithIcon />

      {/* الاسم */}
      <div>
        <label
          htmlFor="contact-name"
          className={`contact-text block mb-2 font-semibold ${
            themeName === "dark" ? "text-stroke-dark" : "text-stroke-light"
          }`}
        >
          {t("lb")}
        </label>
        <input
          id="contact-name"
          type="text"
          name="name"
          value={userData?.name || formData.name}
          onChange={handleChange}
          readOnly={!!userData?.name}
          className={`input-theme ${
            userData?.name
              ? "bg-gray-100 text-gray-600 cursor-not-allowed capitalize"
              : themeName === "dark"
                ? "input-dark"
                : "input-light"
          }`}
          placeholder={t("inp")}
          required
        />
      </div>

      {/* الهاتف */}
      <div>
        <label
          htmlFor="contact-phone"
          className={`contact-text block mb-2 font-semibold ${
            themeName === "dark" ? "text-stroke-dark" : "text-stroke-light"
          }`}
        >
          {t("lb2")}
        </label>
        <input
          id="contact-phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className={`input-theme ${themeName === "dark" ? "input-dark" : "input-light"}`}
          placeholder={t("inp2")}
        />
      </div>

      {/* البريد */}
      <div>
        <label
          htmlFor="contact-email"
          className={`contact-text block mb-2 font-semibold ${
            themeName === "dark" ? "text-stroke-dark" : "text-stroke-light"
          }`}
        >
          {t("lb3")}
        </label>
        <input
          id="contact-email"
          type="email"
          name="email"
          value={userData?.email || formData.email}
          onChange={handleChange}
          readOnly={!!userData?.email}
          className={`input-theme ${
            userData?.email
              ? "bg-gray-100 text-gray-600 cursor-not-allowed"
              : themeName === "dark"
                ? "input-dark"
                : "input-light"
          }`}
          placeholder={t("inp3")}
          required
        />
      </div>

      {/* الرسالة */}
      <div>
        <label
          htmlFor="contact-message"
          className={`contact-text block mb-2 font-semibold ${
            themeName === "dark" ? "text-stroke-dark" : "text-stroke-light"
          }`}
        >
          {t("lb4")}
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows="5"
          className={`input-theme ${themeName === "dark" ? "input-dark" : "input-light"}`}
          placeholder={t("inp4")}
        ></textarea>
      </div>

      {/* زر الإرسال */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-gradient w-full min-h-12 p-4 rounded-2xl cursor-pointer disabled:opacity-60 disabled:cursor-wait"
      >
        {isSubmitting ? "Sending…" : t("btn")}
      </button>
    </motion.form>
  );
}
