"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { decodeJwt } from "@/lib/utils/JWToken";
import { toast } from "react-toastify";
import { useQueryFilters } from "./QueryContext";
import { useRouter } from "next/navigation"; // ✅ لإدارة التنقل
import { supabase } from "@/lib/supabaseClient";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ من QueryContext
  const { updateValue, getEncodedQuery } = useQueryFilters();

  const saveToken = (token) => {
    localStorage.setItem("sb_access", token);
    document.cookie = `sb_access=${token}; path=/; max-age=${2 * 24 * 60 * 60}`;
  };

  const removeToken = () => {
    localStorage.removeItem("sb_access");
    document.cookie = "sb_access=; path=/; max-age=0";
  };

  const getToken = () => {
    const lsToken = localStorage.getItem("sb_access");
    if (lsToken) return lsToken;
    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("sb_access="))
      ?.split("=")[1];
    return cookieToken || null;
  };
  const loginWithGoogle = async () => {
    console.log("🚀 بدء تسجيل الدخول عبر Google...");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/callback/google",
      },
    });
    console.log("📌 نتيجة Supabase:", { data, error });
  };
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error fetching user:", error.message);
        setUser(null);
        setIsLoggedIn(false);
        return;
      }

      if (user) {
        setUser(user);
        setIsLoggedIn(true);

        // ✅ تحديث القيم في QueryContext
        updateValue("id", user.id);
        updateValue("email", user.email);
        updateValue("role", user.user_metadata?.role);
        updateValue("name", user.user_metadata?.name);
        updateValue("avatar", user.user_metadata?.avatar);
        updateValue("gender", user.user_metadata?.gender);

        const encodedQuery = getEncodedQuery();
        router.push(`/?data=${encodedQuery}`);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    };

    checkUser();
  }, []);


const register = async (email, password, name, gender) => {
  setLoading(true);
  setError(null);

  // ✅ تحويل الـ gender إلى الإنجليزية قبل الإرسال
  const normalizeGender = (g) => {
    if (!g) return "other";
    const val = g.toLowerCase();
    if (["male", "hombre","männlich", "男","uomo","homme"].includes(g)) return "male";
  if (["female", "mujer","weiblich","女","donna","femme"].includes(g)) return "female";
    return "other";
  };

  try {
    const res = await axios.post("/api/auth/register", {
      name,
      email,
      password,
      gender: normalizeGender(gender),
    });

    const data = res.data;
    if (!data.user) throw new Error(data.error || "Registration failed");

    toast.success("✅ Account created successfully!");
    return data.user;
  } catch (err) {
    setError(err.message);
    toast.error("❌ Error: " + err.message);
  } finally {
    setLoading(false);
  }
};

const login = async (email, password, onSuccess) => {
  setLoading(true);
  setError(null);
  try {
    const res = await axios.post("/api/auth/login", { email, password }, { withCredentials: true });
    const data = res.data;

    if (res.status !== 200) throw new Error(data.error || "Login failed");

    const user = data.user;
    const session = data.session;

    // ✅ تهيئة الجلسة داخل Supabase
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    setUser(user);
    setIsLoggedIn(true);

    // تحديث QueryContext
    updateValue("id", user.id);
    updateValue("email", user.email);
    updateValue("role", user.user_metadata?.role);
    updateValue("name", user.user_metadata?.name);
    updateValue("avatar", user.user_metadata?.avatar);
    updateValue("gender", user.user_metadata?.gender);

    if (onSuccess) onSuccess();
    const encodedQuery = getEncodedQuery();
    router.push(`/?data=${encodedQuery}`);

    toast.success("✅ Logged in successfully!");
    return user;
  } catch (err) {
    setError(err.message);
    toast.error("❌ Error: " + err.message);
  } finally {
    setLoading(false);
  }
};

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("❌ Error clearing cookies on server:", err);
    }

    setUser(null);
    setIsLoggedIn(false);
    removeToken();
    toast.info("🚪 Logged out successfully");
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        loading,
        error,
        isLoggedIn,
        open,
        setOpen,
        handleOpen,
        handleClose,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
