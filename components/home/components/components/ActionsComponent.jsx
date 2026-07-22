"use client";
import React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

export default function ActionsComponent({
  t,
  loginWithGoogle,
  handleSubmit,
  loading,
  handleLoginOpen,
}) {
  return (
    <>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <IconButton
          onClick={loginWithGoogle}
          style={{ borderRadius: "5px" }}
          className="w-[280px] h-[56px] bg-gradient-to-r from-[#4285F4] via-[#34A853] via-[#FBBC05] to-[#EA4335] text-white font-bold shadow-md hover:shadow-lg flex items-center gap-3 transition-all"
        >
          <FcGoogle size={28} />
          <span>Sign in with Google</span>
        </IconButton>

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

        <Button
          fullWidth
          onClick={handleLoginOpen}
          className={theme.buttonSecondary}
        >
          {t("Alreadyhaveanaccount?Login")}
        </Button>
      </div>
    </>
  );
}
