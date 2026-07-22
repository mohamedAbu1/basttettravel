"use client";
import React from "react";
import { FaUserCircle } from "react-icons/fa";

const UsersSidebar = ({ users,userData, activeUser, setActiveUser, theme, themeName, markMessageSeen, messages }) => {
  // فلترة المستخدمين بحيث نستبعد الـ Admin
  const nonAdminUsers = users.filter(
    (user) => user?.role?.toUpperCase() !== "ADMIN"
  );
console.log(users)
  return (
    <aside
      style={{ marginRight: "5px" }}
      className={`w-72 border-r ${theme.border} p-4 space-y-4 
      ${themeName === "dark" ? "bg-gray-950 text-gray-100" : "bg-white text-gray-900"} 
      shadow-lg`}
    >
      {/* العنوان */}
      <h3
        className={`mb-4 text-lg font-bold tracking-wide 
        ${themeName === "dark" ? "text-yellow-400" : theme.title}`}
      >
        Users
      </h3>

      {/* قائمة المستخدمين */}
      {nonAdminUsers.length > 0 ? (
        nonAdminUsers.map((user) => {
          // عدد الرسائل الجديدة غير المقروءة
          const unreadCount = messages.filter(
            (msg) =>
              msg.user_id === user.id &&
              msg.sender_type === "user" &&
              msg.status === "sent"
          ).length;

          return (
            <div
              key={user.id}
              onClick={() => {
                setActiveUser(user);
                // تحديث حالة الرسائل إلى "seen" عند فتح المحادثة
                messages
                  .filter((msg) => msg.user_id === user.id && msg.status === "sent")
                  .forEach((msg) => markMessageSeen(msg.id));
              }}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-300
                ${
                  activeUser?.id === user.id
                    ? themeName === "dark"
                      ? "bg-yellow-500 text-black shadow-md"
                      : "bg-yellow-400 text-white shadow-md"
                    : themeName === "dark"
                    ? "hover:bg-gray-800"
                    : "hover:bg-gray-100"
                }`}
            >
              {/* صورة المستخدم أو أيقونة افتراضية */}
              {user?.avatar_url ? (
                <img
                  src={user?.avatar_url}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border object-cover"
                />
              ) : (
                <FaUserCircle className="w-10 h-10 text-gray-400" />
              )}

              {/* الاسم */}
              <span className="flex-1 font-medium capitalize">{user?.name}</span>

              {/* Badge لو فيه رسائل جديدة */}
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm">
                  {unreadCount}
                </span>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-sm opacity-70">No non-admin users available.</p>
      )}
    </aside>
  );
};

export default UsersSidebar;
