"use client";
import React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

// مثال على ثيم جاهز
export const theme = {
  buttonPrimary:
    "rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold shadow-lg hover:shadow-xl transition-all",
  buttonSecondary:
    "rounded-xl border border-yellow-500 text-yellow-600 font-semibold hover:bg-yellow-50 transition-all",
  buttonGoogle:
    "bg-gradient-to-r from-[#4285F4] via-[#34A853] via-[#FBBC05] to-[#EA4335] text-white font-bold shadow-md hover:shadow-lg transition-all",
};

export default function ActionsComponent({
  t,
  loginWithGoogle,
  handleSubmit,
  loading,
  handleLoginOpen,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        justifyContent: "center",
        marginTop: "20px",
      }}
    >
      {/* زر تسجيل الدخول بجوجل */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <IconButton
        style={{borderRadius:"15px"}}
          onClick={loginWithGoogle}
          className={`${theme.buttonGoogle} w-[280px] h-[56px] flex items-center gap-3`}
        >
          <FcGoogle size={28} />
          <span className="font-semibold">Sign in with Google</span>
        </IconButton>
      </motion.div>

      {/* زر التسجيل */}
      <motion.div whileHover={{ scale: 1.05 }} style={{ marginTop: "16px" }}>
        <Button
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          className={theme.buttonPrimary}
        >
          {loading ? t("Creating") : t("SignUp")}
        </Button>
      </motion.div>

      {/* زر تسجيل الدخول للحساب الموجود */}
      <Button
        fullWidth
        onClick={handleLoginOpen}
        className={theme.buttonSecondary}
      >
        {t("Alreadyhaveanaccount?Login")}
      </Button>
    </div>
  );
}
