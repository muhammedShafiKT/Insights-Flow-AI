
import { io } from "socket.io-client"

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
  autoConnect: true,
  transports: ["websocket"], // skip HTTP polling handshake entirely
});

// socket.on("connect", () => console.log("[socket] connected:", socket.id))
// socket.on("disconnect", (reason) => console.log("[socket] disconnected:", reason))
// socket.on("connect_error", (err) => console.log("[socket] connect_error:", err.message))