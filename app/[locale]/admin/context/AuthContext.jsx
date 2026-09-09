"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";

const AuthContext = createContext(null);

/**
 * Admin authentication state.
 * The browser only consumes the user returned by the server. Authorization is
 * enforced again inside every protected API route.
 */
export function AuthProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    let cancelled = false;

    const loadSession = async () => {
      try {
        const response = await axios.get("/api/auth/me", { withCredentials: true });
        if (!cancelled) {
          setUser(response.data.user);
          setIsLoggedIn(true);
        }
      } catch {
        try {
          const refreshResponse = await axios.post(
            "/api/auth/refresh",
            {},
            { withCredentials: true },
          );
          if (!cancelled) {
            setUser(refreshResponse.data.user);
            setIsLoggedIn(true);
          }
        } catch {
          if (!cancelled) {
            setUser(null);
            setIsLoggedIn(false);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const register = async (email, password, name, gender, onSuccess) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post("/api/auth/register", {
        email,
        password,
        name,
        gender,
      });

      if (!data.user) {
        throw new Error(data.error || "Registration failed");
      }

      setUser(data.user);
      setIsLoggedIn(true);
      toast.success("✅ Account created successfully!");
      if (onSuccess) setOpen(false);
      return data.user;
    } catch (err) {
      setError(err.message);
      toast.error("❌ Error: " + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, onSuccess) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true },
      );

      if (!data.user) {
        throw new Error(data.error || "Login failed");
      }

      setUser(data.user);
      setIsLoggedIn(true);
      if (onSuccess) onSuccess();
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch {
      // Clear local state even when the logout request cannot reach the server.
    }
    setUser(null);
    setIsLoggedIn(false);
  };

  const userData = user || session?.user;

  return (
    <AuthContext.Provider
      value={{
        userData,
        register,
        login,
        logout,
        loading,
        error,
        isLoggedIn,
        open,
        setOpen,
        handleOpen: () => setOpen(true),
        handleClose: () => setOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
