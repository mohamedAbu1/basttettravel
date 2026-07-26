import { Server } from "socket.io";

let io;

export async function GET() {
  if (!io) {
    io = new Server(globalThis.server, {
      path: "/api/socketio",
      cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
      console.log("✅ Client connected:", socket.id);

      socket.on("new_message", (msg) => {
        console.log("📩 رسالة جديدة:", msg);
        io.emit("new_message", msg);
      });
    });
  }

  return new Response("Socket.IO server running", { status: 200 });
}
