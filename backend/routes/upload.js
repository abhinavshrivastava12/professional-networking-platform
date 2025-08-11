const express = require("express");
const router = express.Router();
const { upload } = require("../config/cloudinary");
const { verifyToken } = require("../middleware/authMiddleware"); // ✅ Correct import

// ✅ Image Upload
router.post("/image", verifyToken, upload.single("image"), (req, res) => {
  res.json({ url: req.file.path });
});

// ✅ Resume Upload (PDF)
router.post("/resume", verifyToken, upload.single("resume"), (req, res) => {
  if (!req.file || !req.file.path.endsWith(".pdf")) {
    return res.status(400).json({ error: "Only PDF resumes allowed" });
  }
  res.json({ url: req.file.path });
});

module.exports = router;
