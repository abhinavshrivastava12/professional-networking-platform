const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const User = require("../models/User");

// GET /api/users - Get all users without password field
router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ msg: "Error fetching users" });
  }
});

module.exports = router;
