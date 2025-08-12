// frontend/src/socket.js or wherever you setup your socket connection

import { io } from "socket.io-client";

const SOCKET_URL = "https://professional-networking-platform.onrender.com";

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,       // send cookies if any
  autoConnect: true,
});

export default socket;
