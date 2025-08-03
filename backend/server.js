const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

// 🌐 Load environment variables
dotenv.config();

// 🔌 Connect to MongoDB
connectDB();

const app = express();

// 🧩 Middlewares
app.use(cors());
app.use(express.json());

// ✅ Root test route to verify API is working
app.get("/", (req, res) => {
  res.send("🟢 API is working!");
});

// ✅ Use all backend routes from ./routes/index.js
const routes = require("./routes");
app.use("/api", routes);

// 🧠 Create HTTP server and bind with Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// 🔌 Socket.io event handling
io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`✅ ${userId} joined socket room`);
  });

  socket.on("send_message", (data) => {
    io.to(data.receiverId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// 🚀 Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// 🔁 Optional heartbeat log
setInterval(() => console.log("⏳ Server heartbeat..."), 5000);
