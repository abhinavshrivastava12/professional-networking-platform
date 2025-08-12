const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const Message = require("../models/Message");

// GET /api/messages/:receiverId - Get messages between logged-in user and receiver
router.get("/:receiverId", verifyToken, async (req, res) => {
  try {
    const { receiverId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId },
        { senderId: receiverId, receiverId: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    return res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
