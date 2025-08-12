import { io } from "socket.io-client";

const token = localStorage.getItem("token");

const socket = io("https://professional-networking-platform.onrender.com", {
  transports: ["polling"], // Safe for Render hosting
  withCredentials: true,
  auth: {
    token: token ? `Bearer ${token}` : "",
  },
});

export default socket;
