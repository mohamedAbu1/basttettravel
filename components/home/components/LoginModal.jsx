"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import { MdEmail, MdLock } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { useData } from "@/context/DataContext";
import { useTheme } from "@/context/ThemeContext"; // ✅ جلب الثيم
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useSecurity } from "@/context/SecurityContext";
import { useTranslation } from "react-i18next";

export default function LoginModal() {
  const { loginOpen, handleLoginClose, handleSignUpOpen } = useData();
  const { theme } = useTheme(); // ✅ يرجع DarkTheme أو LightTheme

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation("home");

  const { login, loginWithGoogle, loading, handleClose } = useAuth();
  const { validateField } = useSecurity();

  const handleSubmit = useCallback(async () => {
    const emailError = validateField("email", email);
    const passwordError = validateField("password", password);

    if (emailError || passwordError) {
      toast.error(emailError || passwordError);
      return;
    }

    try {
      await login(email, password);
      toast.success("✅ Logged in successfully!");
      handleLoginClose();
      handleClose();
    } catch (err) {
      toast.error("❌ Error: The email or password is incorrect.");
    }
  }, [email, password, validateField, login, handleLoginClose, handleClose]);

  return (
    <Dialog open={loginOpen} onClose={handleLoginClose} fullWidth maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`${theme.card} ${theme.shadow}`} // ✅ خلفية الكارد من الثيم
      >
        {/* Header */}
        <div className="text-center py-6">
          <h2 className={`${theme.title} text-4xl`}>
            {t("Login")}
          </h2>
        </div>

        {/* Content */}
        <DialogContent className="flex flex-col gap-5 p-8">
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

          <Divider className={`${theme.border} my-4`}>
            {t("orcontinuewith")}
          </Divider>

          {/* Social Buttons */}
          <div className="flex justify-center mt-4">
            <IconButton
              onClick={loginWithGoogle}
              style={{borderRadius:"5px"}}
              className="w-[280px] h-[56px] bg-gradient-to-r from-[#4285F4] via-[#34A853] via-[#FBBC05] to-[#EA4335] text-white font-bold shadow-md hover:shadow-lg flex items-center gap-3 transition-all"
            >
              <FcGoogle size={28} />
              <span>Sign in with Google</span>
            </IconButton>
          </div>

          {/* Login Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              fullWidth
              onClick={handleSubmit}
              disabled={loading}
              className={theme.buttonPrimary}
            >
              {loading ? t("Loggingin") : t("Login")}
            </Button>
          </motion.div>

          {/* زر العودة إلى إنشاء حساب */}
          <Button
            fullWidth
            onClick={() => {
              handleLoginClose();
              handleSignUpOpen();
            }}
            className={theme.buttonSecondary}
          >
            {t("Don’thaveanaccount?SignUp")}
          </Button>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
