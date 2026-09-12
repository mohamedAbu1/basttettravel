"use client";
import React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

// مثال على ثيم جاهز
export default function ActionsComponent({
  t,
  loginWithGoogle,
  loading,
  handleLoginOpen,
}) {
  return (
    <div className="auth-actions">
      {/* زر تسجيل الدخول بجوجل */}
      <motion.div whileTap={{ scale: 0.98 }} className="auth-action-wide">
        <IconButton
          onClick={loginWithGoogle}
          className="auth-google-button"
          type="button"
        >
          <FcGoogle size={28} />
          <span className="font-semibold">{t("continueWithGoogle", { defaultValue: "Continue with Google" })}</span>
        </IconButton>
      </motion.div>

      {/* زر التسجيل */}
      <motion.div whileTap={{ scale: 0.98 }} className="auth-action-wide">
        <Button
          fullWidth
          type="submit"
          disabled={loading}
          className="auth-primary-button"
        >
          {loading ? t("Creating") : t("SignUp")}
        </Button>
      </motion.div>

      {/* زر تسجيل الدخول للحساب الموجود */}
      <Button
        fullWidth
        onClick={handleLoginOpen}
        className="auth-secondary-button"
        type="button"
      >
        {t("Alreadyhaveanaccount?Login")}
      </Button>
    </div>
  );
}
