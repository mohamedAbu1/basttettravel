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
import { FaFacebook } from "react-icons/fa";
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
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/callback/google",
      },
    });
    if (error) toast.error(error.message);
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
          <div className="flex gap-4 justify-center">
            <IconButton onClick={loginWithGoogle}>
              <FcGoogle size={26} />
            </IconButton>
            <IconButton className={theme.iconHover}>
              <FaFacebook size={26} />
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
