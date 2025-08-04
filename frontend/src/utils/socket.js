import { io } from "socket.io-client";

const socket = io("https://professional-networking-platform.onrender.com", {
  transports: ["polling"], // ✅ Required for Render (prevents WebSocket fail)
  withCredentials: true,
});

export default socket;
