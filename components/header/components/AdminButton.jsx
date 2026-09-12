"use client";
import React from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

const AdminButton = () => {
  const router = useRouter();
  const muiTheme = useTheme();
  const { userData } = useAuth();
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";

  const goToAdmin = () => {
    router.push(`/${locale}/admin`);
  };
  const isAdmin = String(userData?.role).toUpperCase() === "ADMIN";

  return (
    <>
      {isAdmin && (
        <Button
          variant="contained"
          onClick={goToAdmin}
          sx={{
            fontWeight: "600",
            textTransform: "capitalize",
            borderRadius: "8px",
            backgroundColor: muiTheme.palette.secondary.main,
            "&:hover": {
              backgroundColor: muiTheme.palette.secondary.dark,
            },
          }}
        >
          Admin Dashboard
        </Button>
      )}
    </>
  );
};

export default AdminButton;
