"use client";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { useData } from "@/context/DataContext";
import { useTheme } from "@/context/ThemeContext"; // ✅ جلب الثيم
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useSecurity } from "@/context/SecurityContext";
import { useTranslation } from "react-i18next";
import DividerWithIcon from "@/components/layout/DividerWithIcon";

export default function LoginModal() {
  const { loginOpen, handleLoginClose, handleSignUpOpen } = useData();
  const { theme } = useTheme(); // ✅ يرجع DarkTheme أو LightTheme

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation("home");

  const { login, loginWithGoogle, loading, handleClose } = useAuth();
  const { validateField } = useSecurity();

  const handleSubmit = useCallback(async (event) => {
    event?.preventDefault();
    const emailError = validateField("email", email);
    const passwordError = validateField("password", password);

    if (emailError || passwordError) {
      toast.error(emailError || passwordError);
      return;
    }

    try {
      const result = await login(email, password);
      if (!result?.success) return;
      handleLoginClose();
      handleClose();
    } catch (err) {
      toast.error("❌ Error: The email or password is incorrect.");
    }
  }, [email, password, validateField, login, handleLoginClose, handleClose]);

  return (
    <Dialog
      open={loginOpen}
      onClose={handleLoginClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ className: "auth-dialog-paper" }}
      BackdropProps={{ className: "auth-dialog-backdrop" }}
      aria-labelledby="login-title"
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="auth-modal auth-modal-login"
      >
        <div className="auth-modal-header">
          <div>
            <p className="auth-modal-eyebrow">Basttet Travel</p>
            <h2 id="login-title" className="auth-modal-title">{t("Login")}</h2>
            <p className="auth-modal-description">{t("authLoginDescription", { defaultValue: "Continue your journey with your Basttet Travel account." })}</p>
          </div>
          <IconButton onClick={handleLoginClose} className="auth-close-button" aria-label={t("close", { defaultValue: "Close" })}>
            <CloseIcon />
          </IconButton>
        </div>
        <DividerWithIcon />
        {/* Content */}
        <DialogContent component="form" onSubmit={handleSubmit} className="auth-modal-content flex flex-col gap-5">
          <TextField
            label={t("Email")}
            type="email"
            fullWidth
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdEmail className={theme.icon} />
                </InputAdornment>
              ),
            }}
            className="auth-field"
          />

          <TextField
            label={t("Password")}
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            autoComplete="current-password"
            inputProps={{ minLength: 8, maxLength: 128 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MdLock className={theme.icon} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </InputAdornment>
              ),
            }}
          />

        <DividerWithIcon />

          {/* Social Buttons */}
          <div className="auth-action-wide">
            <IconButton
              onClick={loginWithGoogle}
              type="button"
              className="auth-google-button"
            >
              <FcGoogle size={28} />
              <span>{t("continueWithGoogle", { defaultValue: "Continue with Google" })}</span>
            </IconButton>
          </div>

          {/* Login Button */}
          <motion.div whileTap={{ scale: 0.98 }} className="auth-action-wide">
            <Button
              fullWidth
              type="submit"
              disabled={loading}
              className="auth-primary-button"
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
            className="auth-secondary-button"
            type="button"
          >
            {t("Don’thaveanaccount?SignUp")}
          </Button>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
