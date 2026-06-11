"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Button,
  Dialog,
  DialogContent,
  Divider,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaFemale, FaMale } from "react-icons/fa";
import { useData } from "@/context/DataContext";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "react-toastify";
import { useSecurity } from "@/context/SecurityContext";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabaseClient";

export default function SignUpModal() {
  const { handleLoginOpen } = useData();
  const { theme } = useTheme(); // ✅ جلب الثيم
  const { validateField } = useSecurity();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const { t } = useTranslation("home");

  const { register, loading, open, handleClose } = useAuth();

  const handleSubmit = async () => {
    const nameError = validateField("Full Name", fullName);
    const emailError = validateField("Email", email);
    const passwordError = validateField("Password", password);
    if (nameError || emailError || passwordError || !gender) {
      toast.error(nameError || emailError || passwordError || "Gender is required");
      return;
    }
    try {
      await register(email, password, fullName, gender);
      toast.success("✅ A confirmation message has been sent to your account.");
      handleClose();
    } catch (err) {
      toast.error("❌ Error: " + err.message);
    }
  };
  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "select_account consent",
          },
        },
      });

      if (error) {
        toast.error(`❌ خطأ في الاتصال بجوجل: ${error.message}`);
      }
    } catch (err) {
      console.error("OAuth Error:", err);
      toast.error("❌ حدث خطأ غير متوقع أثناء تسجيل الدخول.");
    }
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`p-6 ${theme.card}`} // ✅ خلفية الكارد من الثيم
        style={{ borderRadius: "24px" }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className={`text-4xl font-bold tracking-wide ${theme.title}`}>
            Montu Travel
          </h1>
        </div>

        {/* Content */}
        <DialogContent className="flex flex-col gap-5">
          <TextField
            label={t("FullName")}
            fullWidth
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdPerson className={theme.icon} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label={t("Email")}
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdEmail className={theme.icon} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label={t("Password")}
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdLock className={theme.icon} />
                </InputAdornment>
              ),
            }}
          />

          <FormLabel component="legend" className={`${theme.text} font-semibold`}>
            {t("Gender")}
          </FormLabel>
          <RadioGroup
            row
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="justify-center gap-6"
          >
            <FormControlLabel
              value={t("male")}
              control={<Radio />}
              label={
                <div className="flex items-center gap-2">
                  <FaMale className={theme.icon} /> {t("male")}
                </div>
              }
            />
            <FormControlLabel
              value={t("female")}
              control={<Radio />}
              label={
                <div className="flex items-center gap-2">
                  <FaFemale className={theme.icon} /> {t("female")}
                </div>
              }
            />
          </RadioGroup>

          <Divider className={`${theme.border} my-4`}>
            {t("orsignupwith")}
          </Divider>

          {/* Social Buttons */}
         <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <IconButton
              onClick={loginWithGoogle}
              style={{
                width: "280px",
                height: "56px",
                borderRadius: "12px",
                background:
                  "linear-gradient(to right, #4285F4, #34A853, #FBBC05, #EA4335)",
                color: "#fff",
                fontWeight: "700",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                transition: "all 0.3s ease",
              }}
            >
              <FcGoogle size={28} />
              <span style={{ color: "#fff" }}>Sign in with Google</span>
            </IconButton>
          </div>
          {/* Sign Up Button */}
          <motion.div whileHover={{ scale: 1.05 }} className="mt-4">
            <Button
              fullWidth
              onClick={handleSubmit}
              disabled={loading}
              className={theme.buttonPrimary} // ✅ زر من الثيم
            >
              {loading ? t("Creating") : t("SignUp")}
            </Button>
          </motion.div>

          {/* زر فتح نافذة تسجيل الدخول */}
          <Button
            fullWidth
            onClick={handleLoginOpen}
            className={theme.buttonSecondary} // ✅ زر ثانوي من الثيم
          >
            {t("Alreadyhaveanaccount?Login")}
          </Button>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
