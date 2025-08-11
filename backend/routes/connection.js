const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware"); // ✅ fix import
const {
  sendRequest,
  acceptRequest,
  getConnections,
  getPendingRequests,
} = require("../controllers/connectionController");

// ✅ Send a connection request
router.post("/send", verifyToken, sendRequest);

// ✅ Accept a connection request
router.post("/accept", verifyToken, acceptRequest);

// ✅ Get all connected users
router.get("/list", verifyToken, getConnections);

// ✅ Get all pending connection requests
router.get("/pending", verifyToken, getPendingRequests);

module.exports = router;
