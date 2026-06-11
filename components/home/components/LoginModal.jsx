"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import { MdEmail, MdLock } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { useData } from "@/context/DataContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useSecurity } from "@/context/SecurityContext";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabaseClient";

export default function LoginModal() {
  const { loginOpen, handleLoginClose, handleOpen } = useData();
  const { theme } = useTheme(); // ✅ جلب الثيم
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useTranslation("home");

  const { login, loading, handleClose } = useAuth();
  const { validateField } = useSecurity();

  const handleSubmit = async () => {
    const emailError = validateField("Email", email);
    const passwordError = validateField("Password", password);

    if (emailError || passwordError) {
      toast.error(emailError || passwordError);
      return;
    }

    try {
      await login(email, password);
      toast.success("Logged in successfully!");
      handleLoginClose();
      handleClose();
    } catch (err) {
      toast.error("❌ Error: The email or password is incorrect.");
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
    <Dialog open={loginOpen} onClose={handleLoginClose} fullWidth maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`p-6 ${theme.card}`} // ✅ خلفية الكارد من الثيم
        style={{ borderRadius: "24px" }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className={`text-3xl font-bold ${theme.title}`}>
            {t("Login")}
          </h2>
        </div>

        {/* Content */}
        <DialogContent className="flex flex-col gap-5">
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

          {/* Login Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              fullWidth
              onClick={handleSubmit}
              disabled={loading}
              className={theme.buttonPrimary} // ✅ زر من الثيم
            >
              {loading ? t("Loggingin") : t("Login")}
            </Button>
          </motion.div>

          {/* زر العودة إلى إنشاء حساب */}
          <Button
            fullWidth
            onClick={() => {
              handleLoginClose();
              handleOpen();
            }}
            className={theme.buttonSecondary} // ✅ زر ثانوي من الثيم
          >
            {t("Don’thaveanaccount?SignUp")}
          </Button>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
}
