const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ✅ Allowed Origins for CORS
const allowedOrigins = [
  "https://abhinavshrivastava12.github.io",
  "http://localhost:3000"
];

// ✅ CORS Setup
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS Blocked Origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight support

app.use(express.json());

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("🟢 API is working!");
});

// ✅ All API Routes
const routes = require("./routes");
app.use("/api", routes);

// ✅ Create server for socket.io
const server = http.createServer(app);

// ✅ Socket.io config (Render-safe: polling only)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["polling"] // ✅ Safe for Render
});

// ✅ Socket logic
io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`✅ User ${userId} joined socket room`);
  });

  socket.on("send_message", (data) => {
    io.to(data.receiverId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// 🔁 Heartbeat
setInterval(() => {
  console.log("💓 Server heartbeat...");
}, 30000);
