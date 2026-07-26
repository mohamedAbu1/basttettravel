import { Server } from "socket.io";

let io;

export async function GET(req) {
  if (!io) {
    io = new Server(globalThis.server, {
      path: "/api/socket",
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log("✅ Client connected:", socket.id);

      socket.on("new_message", (msg) => {
        console.log("📩 رسالة جديدة:", msg);
        io.emit("new_message", msg); // يبعت الرسالة لكل الكلاينتس
      });

      socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
      });
    });
  }

  return new Response("Socket initialized", { status: 200 });
}
