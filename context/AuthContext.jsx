"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useQueryFilters } from "./QueryContext";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react"; // ✅ NextAuth
import { useData } from "./DataContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { data: session } = useSession(); // ✅ جلب المستخدم من جوجل عبر NextAuth
  const [chatUser, setChatUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  const [user, setUser] = useState(null); // بيانات من API
  const [UserToken, setUserToken] = useState(null); // بيانات من التوكين
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { handleSignUpClose } = useData();
  const { updateValue, getEncodedQuery } = useQueryFilters();

  const fetchUserFromServer = async () => {
    try {
      const res = await axios.get("/api/auth/me", { withCredentials: true });
      if (!res.data?.user) {
        setUser(null);
        setUserToken(null);
        setIsLoggedIn(false);
        return;
      }
      setUser(res.data.user);
      setUserToken(res.data.user);
      setIsLoggedIn(true);
    } catch (err) {
      const initialStatus = err.response?.status;
      try {
        const retry = await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true },
        );
        if (!retry.data?.user) {
          setUser(null);
          setUserToken(null);
          setIsLoggedIn(false);
          return;
        }
        setUser(retry.data.user);
        setUserToken(retry.data.user);
        setIsLoggedIn(true);
      } catch (refreshErr) {
        // Guests commonly have no refresh cookie; this is an expected auth state,
        // not an application error that should trigger a recoverable-render overlay.
        if (initialStatus !== 401 && refreshErr.response?.status !== 401) {
          console.warn("Authentication refresh unavailable:", refreshErr.message);
        }
        setUserToken(null);
        setUser(null);
        setIsLoggedIn(false);
      }
    }
  };

  // ✅ استدعاء عند تحميل الصفحة
  useEffect(() => {
    fetchUserFromServer();
  }, []);

  // NextAuth completes Google OAuth after the browser returns from Google's
  // callback. Only then can the application issue its own auth cookies.
  useEffect(() => {
    if (!session?.user?.email || user) return;

    let cancelled = false;
    axios
      .post("/api/auth/google", {}, { withCredentials: true })
      .then(({ data }) => {
        if (cancelled || !data?.user) return;
        setUser(data.user);
        setUserToken(data.user);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Google account sync failed:", err.message);
          toast.error("❌ تعذر إكمال تسجيل الدخول بجوجل.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session?.user?.email, user]);

  // ✅ تسجيل مستخدم جديد يدويًا
  const register = async (email, password, name, gender) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        "/api/auth/register",
        { name: name.trim(), email: email.trim().toLowerCase(), password, gender },
        { withCredentials: true },
      );
      const data = res.data;
      if (res.status !== 201)
        throw new Error(data.error || "Registration failed");

      toast.success("✅ Account created successfully!");
      setUser(data.user);
      setUserToken(data.user);
      setIsLoggedIn(true);
      handleSignUpClose();
      return { success: true, ...data };
    } catch (err) {
      setError(err.message);
      toast.error("❌ Error: " + err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ✅ تسجيل الدخول يدويًا
  const login = async (email, password, onSuccess) => {
    setLoading(true);
    setError(null);
    try {

      const res = await axios.post(
        "/api/auth/login",
        { email: email.trim().toLowerCase(), password },
        { withCredentials: true },
      );

      const data = res.data;

      if (res.status !== 200) {
        console.error("❌ فشل تسجيل الدخول:", data.error);
        throw new Error(data.error || "Login failed");
      }

      const user = data.user;

      setUser(user);

      // ✅ جلب بيانات المستخدم من السيرفر بعد تسجيل الدخول
      await fetchUserFromServer();

      setIsLoggedIn(true);

      if (onSuccess) {
        onSuccess();
      }

      const encodedQuery = getEncodedQuery();
      router.push(`/?data=${encodedQuery}`);

      toast.success("✅ Logged in successfully!");
      return { success: true, user };
    } catch (err) {
      console.error("💥 خطأ أثناء تسجيل الدخول:", err.message);
      setError(err.message);
      toast.error("❌ Error: " + err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ✅ تسجيل الدخول بجوجل
  const loginWithGoogle = async () => {
    try {
      // OAuth providers must be allowed to perform the full browser redirect.
      // Using redirect:false here can leave the state cookie and callback
      // exchange incomplete, which causes "State cookie was missing".
      const result = await signIn("google", {
        callbackUrl: window.location.href,
      });
      if (result?.error) {
        toast.error("❌ خطأ أثناء تسجيل الدخول بجوجل: " + result.error);
      }
    } catch (err) {
      console.error("OAuth Error:", err);
      toast.error("❌ حدث خطأ غير متوقع أثناء تسجيل الدخول بجوجل.");
    }
  };

  // ✅ تسجيل الخروج
  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("❌ Error clearing cookies on server:", err);
    }
    try {
      await signOut({ redirect: false });
    } catch (err) {
      console.warn("NextAuth logout unavailable:", err.message);
    }
    setUser(null);
    setUserToken(null);
    setIsLoggedIn(false);
    toast.info("🚪 Logged out successfully");
  };

  const userData = user || session?.user;
  return (
    <AuthContext.Provider
      value={{
        userData, // بيانات من API أو من Google
        register,
        login,
        loginWithGoogle, // ✅ تسجيل الدخول بجوجل
        logout,
        loading,
        error,
        isLoggedIn,
        open,
        setOpen,
        handleOpen,
        handleClose,
        fetchUserFromServer,
        chatUser,
        setChatUser,
        chatMessages,
        setChatMessages,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
