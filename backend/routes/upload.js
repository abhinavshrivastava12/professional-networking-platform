const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");
const { verifyToken } = require("../middleware/authMiddleware");

// POST /api/upload/image - Upload image file
router.post("/image", verifyToken, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });
  return res.json({ url: req.file.path });
});

// POST /api/upload/resume - Upload PDF resume
router.post("/resume", verifyToken, upload.single("resume"), (req, res) => {
  if (!req.file || !req.file.path.endsWith(".pdf")) {
    return res.status(400).json({ error: "Only PDF resumes allowed" });
  }
  return res.json({ url: req.file.path });
});

module.exports = router;
