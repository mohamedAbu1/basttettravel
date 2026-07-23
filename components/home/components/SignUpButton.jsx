"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { motion } from "framer-motion";
import { useData } from "@/context/DataContext";
import { useTheme } from "@/context/ThemeContext"; // ✅ جلب الثيم
import { toast } from "react-toastify";
import { useSecurity } from "@/context/SecurityContext";
import { useTranslation } from "react-i18next";
import HeaderComponent from "./components/HeaderComponent";
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
  const { t } = useTranslation("home");

  const { register, loading, loginWithGoogle, handleClose } = useAuth();

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

  return (
    <Dialog open={signUpOpen} onClose={handleSignUpClose} fullWidth maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`${theme.card} ${theme.shadow}`} // ✅ خلفية الكارد من الثيم
      >
        {/* Header */}
        <HeaderComponent theme={theme} />
        <DividerWithIcon />

        {/* Content */}
        <DialogContent className="flex flex-col gap-5 p-8">
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
            theme={theme} // ✅ تمرير الثيم للفورم
          />
        <DividerWithIcon />

          <ActionsComponent
            t={t}
            loginWithGoogle={loginWithGoogle}
            handleSubmit={handleSubmit}
            loading={loading}
            handleLoginOpen={handleLoginOpen}
            theme={theme} // ✅ تمرير الثيم للأزرار
          />
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
