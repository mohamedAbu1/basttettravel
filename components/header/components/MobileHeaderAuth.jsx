"use client";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function MobileHeaderAuth() {
  const { userData, loginWithGoogle, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

 
  return (
    <div>
      {!userData ? (
        <button type="button" onClick={loginWithGoogle} aria-label="Sign in with Google" className="mobile-auth-button">
          <FcGoogle size={28} />
        </button>
      ) : (
        <>
          <button type="button" onClick={handleOpenMenu} aria-label="Open account menu" className="mobile-auth-button">
            <img
              src={userData?.avatar_url || userData?.image || "/default-avatar.png"}
              alt={userData?.name}
              width="32"
              height="32"
            />
          </button>

          {anchorEl && (
            <div className="mobile-auth-menu">
              <button type="button" onClick={() => { handleCloseMenu(); logout(); }}>Logout</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
