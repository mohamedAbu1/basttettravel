"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useQueryFilters } from "./QueryContext";
import { useRouter } from "next/navigation";
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

  const { updateValue, getEncodedQuery } = useQueryFilters();

 const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            process.env.NEXT_PUBLIC_BASE_URL + "/api/auth/callback/google",
          queryParams: {
            access_type: "offline",
            prompt: "select_account consent",
          },
        },
      });
      if (error) {
        toast.error("❌ خطأ في تسجيل الدخول بجوجل: " + error.message);
      }
    } catch (err) {
      console.error("OAuth Error:", err);
      toast.error("❌ حدث خطأ غير متوقع أثناء تسجيل الدخول بجوجل.");
    }
  };

  // ✅ متابعة الجلسة بشكل مباشر
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const u = session.user;

          // ✅ الدور موجود في user_metadata بعد أول تسجيل
          const role = u.user_metadata?.role ||  u.email === "ismailharoun225@gmail.com" ||
      u.email === "Basttettravel@outlook.com" || u.email === "mohamedahmed33m11@gmail.com" ? "admin" : "user";

          const mergedUser = { ...u, role };
          setUser(mergedUser);
          setIsLoggedIn(true);
        console.log("🔎 Current User:", mergedUser);
          // تحديث الفلاتر
          updateValue("id", u.id);
          updateValue("email", u.email);
          updateValue("role", role);
          updateValue("name", u.user_metadata?.name);
          updateValue("avatar", u.user_metadata?.avatar);
          updateValue("gender", u.user_metadata?.gender);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);



  const register = async (email, password, name, gender) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        gender,
      });
      const data = res.data;
      if (!data.user) throw new Error(data.error || "Registration failed");

      // ✅ حفظ الجلسة بعد التسجيل
      if (data.session) {
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
      }

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
      const res = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      const data = res.data;
      if (res.status !== 200) throw new Error(data.error || "Login failed");

      const user = data.user;
      const session = data.session;

      // ✅ حفظ الجلسة في Supabase client
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      });

      setUser(user);
      setIsLoggedIn(true);

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
      await supabase.auth.signOut(); // ✅ إنهاء الجلسة في Supabase
    } catch (err) {
      console.error("❌ Error clearing cookies on server:", err);
    }
    setUser(null);
    setIsLoggedIn(false);
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
