const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

// Load .env & connect DB
dotenv.config();
connectDB();

const app = express();

// ✅ CORS settings
const allowedOrigins = [
  "https://abhinavshrivastava12.github.io", // GitHub Pages
  "http://localhost:3000",                  // Local Dev
  "https://professional-networking-platform.onrender.com" // Render frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ✅ Routes
const routes = require("./routes");
app.use("/api", routes);

// ✅ Health Check Endpoint
app.get("/", (req, res) => {
  res.status(200).json({ message: "✅ API is running fine!" });
});

// ✅ Create HTTP Server
const server = http.createServer(app);

// ✅ Setup WebSocket Server (Socket.IO)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  allowEIO3: true, // optional for compatibility
});

// ✅ Socket Events
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`📶 User ${userId} joined room`);
  });

  socket.on("send_message", (data) => {
    io.to(data.receiverId).emit("receive_message", data);
    console.log(`📤 Message sent from ${data.senderId} to ${data.receiverId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server live on port ${PORT}`);
});
