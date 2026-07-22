import { motion, AnimatePresence } from "framer-motion";
import { FaClock, FaDownload, FaExpand } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { saveAs } from "file-saver";
import EgyptianBackground from "@/components/layout/EgyptianBackground";

export default function ChatMessages({ messages, userTyping, themeName }) {
  const handleDownload = async (url, id) => {
    const response = await fetch(url);
    const blob = await response.blob();
    // نحول الصورة لـ object URL
    const img = new Image();
    img.src = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // نحدد أبعاد الصورة
      canvas.width = img.width;
      canvas.height = img.height;

      // نرسم الصورة على الـ canvas
      ctx.drawImage(img, 0, 0);

      // نحولها لـ Blob بجودة محددة (0.7 = 70%)
      canvas.toBlob(
        (newBlob) => {
          saveAs(newBlob, `chat-image-${id}.jpg`);
        },
        "image/jpeg",
        0.7,
      );
    };
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4">
      <EgyptianBackground />
      <AnimatePresence>
        {messages.length > 0 ? (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-3 max-w-[100%] ${
                msg.sender_type === "user"
                  ? "self-start"
                  : "self-end flex-row-reverse"
              }`}
            >
              {/* ✅ صورة المرسل من قاعدة البيانات */}
              <img
                src={msg.user_image || "/default-avatar.png"}
                alt={msg.user_name}
                className={`w-12 h-12 rounded-full border ${
                  msg.sender_type === "admin" ? "border-yellow-500" : ""
                } object-cover`}
              />

              <div
                className={`p-3 rounded-lg shadow-md max-w-[70%] ${
                  msg.sender_type === "user"
                    ? themeName === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200 text-black"
                    : themeName === "dark"
                      ? "bg-yellow-500 text-black"
                      : "bg-yellow-400 text-white"
                }`}
              >
                <p className="text-sm font-semibold mb-1 capitalize">
                  {msg.sender_type === "admin" ? "👑 Admin" : msg.user_name}
                </p>

                {/* ✅ عرض الصور أو النصوص */}
                {typeof msg.content === "string" &&
                msg.content.startsWith("http") &&
                msg.content.match(/\.(jpeg|jpg|gif|png|webp)$/) ? (
                  <img
                    src={msg.content}
                    alt="message image"
                    className="rounded-lg shadow-md"
                  />
                ) : typeof msg.content === "string" &&
                  msg.content.startsWith("data:image/") ? (
                  <img
                    src={msg.content}
                    alt="message image"
                    className="rounded-lg shadow-md"
                  />
                ) : (
                  <p className="text-sm">{msg.content || ""}</p>
                )}

                {/* ✅ وقت الإرسال وحالة الرسالة */}
                <div className="flex items-center gap-1 mt-1">
                  <FaClock className="text-xs opacity-70" />
                  <span className="text-xs italic opacity-70">
                    {msg.created_at
                      ? formatDistanceToNow(new Date(msg.created_at), {
                          addSuffix: true,
                        })
                      : ""}
                  </span>
                  {msg.status && (
                    <span className="text-xs ml-2 opacity-70">
                      {msg.status === "sent" ? "✅ Sent" : "👀 Seen"}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-sm opacity-70">No messages yet...</p>
        )}
      </AnimatePresence>

      {userTyping && (
        <p className="text-xs italic opacity-70">User is typing...</p>
      )}
    </div>
  );
}
