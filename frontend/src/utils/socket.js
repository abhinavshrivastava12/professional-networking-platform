import { io } from "socket.io-client";

const token = localStorage.getItem("token");

const socket = io("https://professional-networking-platform.onrender.com", {
  transports: ["websocket", "polling"],
  withCredentials: true,
  auth: {
    token: token ? `Bearer ${token}` : "",
  },
  extraHeaders: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

export default socket;
