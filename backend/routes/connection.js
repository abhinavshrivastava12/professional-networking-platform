const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware"); // Import auth middleware

const {
  sendRequest,
  acceptRequest,
  getConnections,
  getPendingRequests,
} = require("../controllers/connectionController");

// POST /api/connections/send - Send a connection request
router.post("/send", verifyToken, sendRequest);

// POST /api/connections/accept - Accept a connection request
router.post("/accept", verifyToken, acceptRequest);

// GET /api/connections/list - Get all connected users
router.get("/list", verifyToken, getConnections);

// GET /api/connections/pending - Get all pending connection requests
router.get("/pending", verifyToken, getPendingRequests);

module.exports = router;
