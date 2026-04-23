import React from "react";
import { FaUsers } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

const UserCard = ({ user }) => {
  const { theme } = useTheme();
  return (
    <div className="flex items-center gap-3">
      {user?.user_metadata?.avatar ? (
        <img src={user?.user_metadata?.avatar} alt={user?.user_metadata?.name} className="w-12 h-12 rounded-full object-cover border" />
      ) : (
        <div className="w-12 h-12 rounded-full flex items-center justify-center">
          <FaUsers />
        </div>
      )}
      <div>
        <p className={`font-semibold capitalize ${theme.textAccent}`}>{user?.user_metadata?.name}</p>
        <p className="text-sm opacity-70">{user?.user_metadata?.email}</p>
      </div>
    </div>
  );
};

export default UserCard;
