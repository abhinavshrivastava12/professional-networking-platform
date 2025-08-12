const express = require("express");
const router = express.Router();

// Import all sub-routes
const authRoutes = require("./auth");
const userRoutes = require("./user");
const postRoutes = require("./post");
const connectionRoutes = require("./connection");
const uploadRoutes = require("./upload");
const jobRoutes = require("./job");
const messageRoutes = require("./message");

// Mount API routes
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/connections", connectionRoutes);
router.use("/upload", uploadRoutes);
router.use("/jobs", jobRoutes);
router.use("/messages", messageRoutes);

// Health check route
router.get("/", (req, res) => {
  res.status(200).json({ message: "✅ API is live and running fine!" });
});

// Catch-all 404 handler for undefined API routes
router.all("*", (req, res) => {
  res.status(404).json({ error: "❌ API route not found" });
});

module.exports = router;
