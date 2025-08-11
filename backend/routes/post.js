const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware"); // ✅ fix import
const {
  getFeed,
  createPost,
  likePost,
  commentPost,
  repost,
} = require("../controllers/postController");

// ✅ GET feed
router.get("/feed", verifyToken, getFeed);

// ✅ POST new post
router.post("/", verifyToken, createPost);

// ✅ Like post
router.put("/like/:postId", verifyToken, likePost);

// ✅ Comment
router.post("/comment/:postId", verifyToken, commentPost);

// ✅ Repost
router.post("/repost/:postId", verifyToken, repost);

module.exports = router;
