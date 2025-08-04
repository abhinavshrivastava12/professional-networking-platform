import { io } from "socket.io-client";

const socket = io("https://professional-networking-platform.onrender.com", {
  transports: ["polling"], // 🔒 safer on Render
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

socket.on("connect", () => {
  console.log("✅ Connected to socket server:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

export default socket;
