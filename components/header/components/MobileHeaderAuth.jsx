"use client";
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";

export default function MobileHeaderAuth() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const { user, loginWithGoogle } = useAuth();

  if (!isMobile) return null;

  return (
    <div>
      {!user ? (
        <IconButton
          onClick={loginWithGoogle}
          style={{ borderRadius: "15px" }}
        >
          <FcGoogle size={28} />
        </IconButton>
      ) : (
        <Avatar src={user.image} alt={user.name} />
      )}
    </div>
  );
}
