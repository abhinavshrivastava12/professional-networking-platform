const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  getFeed,
  createPost,
  likePost,
  commentPost,
  repost,
} = require("../controllers/postController");

// GET /api/posts/feed - Get user feed
router.get("/feed", verifyToken, getFeed);

// POST /api/posts - Create new post
router.post("/", verifyToken, createPost);

// PUT /api/posts/like/:postId - Like a post
router.put("/like/:postId", verifyToken, likePost);

// POST /api/posts/comment/:postId - Add comment
router.post("/comment/:postId", verifyToken, commentPost);

// POST /api/posts/repost/:postId - Repost
router.post("/repost/:postId", verifyToken, repost);

module.exports = router;
