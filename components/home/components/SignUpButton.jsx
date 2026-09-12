"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";
import { useData } from "@/context/DataContext";
import { useTheme } from "@/context/ThemeContext"; // ✅ جلب الثيم
import { toast } from "react-toastify";
import { useSecurity } from "@/context/SecurityContext";
import { useTranslation } from "react-i18next";
import FormComponent from "./components/FormComponent";
import ActionsComponent from "./components/ActionsComponent";
import DividerWithIcon from "@/components/layout/DividerWithIcon";

export default function SignUpModal() {
  const { handleLoginOpen, signUpOpen, handleSignUpClose } = useData();
  const { theme } = useTheme(); // ✅ يرجع DarkTheme أو LightTheme
  const { validateField } = useSecurity();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation("home");

  const { register, loading, loginWithGoogle } = useAuth();

  const handleSubmit = async (event) => {
    event?.preventDefault();
    const nameError = validateField("Full Name", fullName);
    const emailError = validateField("Email", email);
    const passwordError = validateField("Password", password);
    if (nameError || emailError || passwordError || !gender) {
      toast.error(nameError || emailError || passwordError || t("genderRequired", { defaultValue: "Please choose your gender." }));
      return;
    }
    try {
      const result = await register(email, password, fullName, gender);
      if (!result?.success) return;
      handleSignUpClose();
    } catch (err) {
      toast.error("❌ Error: " + err.message);
    }
  };

  return (
    <Dialog
      open={signUpOpen}
      onClose={handleSignUpClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ className: "auth-dialog-paper" }}
      BackdropProps={{ className: "auth-dialog-backdrop" }}
      aria-labelledby="signup-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="auth-modal auth-modal-signup"
      >
        <div className="auth-modal-header">
          <div>
            <p className="auth-modal-eyebrow">Basttet Travel</p>
            <h2 id="signup-title" className="auth-modal-title">{t("SignUp")}</h2>
            <p className="auth-modal-description">{t("authSignupDescription", { defaultValue: "Create your account and start planning Egypt with local experts." })}</p>
          </div>
          <IconButton onClick={handleSignUpClose} className="auth-close-button" aria-label={t("close", { defaultValue: "Close" })}>
            <CloseIcon />
          </IconButton>
        </div>
        <DividerWithIcon />

        <DialogContent component="form" onSubmit={handleSubmit} className="auth-modal-content flex flex-col gap-5">
          <FormComponent
            t={t}
            fullName={fullName}
            setFullName={setFullName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            gender={gender}
            setGender={setGender}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            theme={theme} // ✅ تمرير الثيم للفورم
          />
        <DividerWithIcon />

          <ActionsComponent
            t={t}
            loginWithGoogle={loginWithGoogle}
            handleSubmit={handleSubmit}
            loading={loading}
            handleLoginOpen={handleLoginOpen}
          />
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
