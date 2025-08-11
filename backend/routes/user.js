// backend/routes/user.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware"); // ✅ direct function import
const User = require("../models/User");

// ✅ GET all users (excluding password)
router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ msg: "Error fetching users" });
  }
});

module.exports = router;
