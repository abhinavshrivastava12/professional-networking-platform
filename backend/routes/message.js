const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware"); // ✅ Correct import
const Message = require("../models/Message");

router.get("/:receiverId", verifyToken, async (req, res) => {
  const { receiverId } = req.params;
  const messages = await Message.find({
    $or: [
      { senderId: req.user._id, receiverId },
      { senderId: receiverId, receiverId: req.user._id }
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
});

module.exports = router;
