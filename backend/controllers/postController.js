const Post = require("../models/Post");

const getFeed = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name")
      .populate("comments.userId", "name");
    res.json(posts);
  } catch (error) {
    console.error("Failed to fetch feed:", error);
    res.status(500).json({ error: "Failed to fetch feed" });
  }
};

const createPost = async (req, res) => {
  try {
    const newPost = await Post.create({
      userId: req.user.id,
      content: req.body.content,
      image: req.body.image || "",
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Post creation failed:", error);
    res.status(500).json({ error: "Post creation failed" });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.user.id;
    const index = post.likes.indexOf(userId);

    if (index === -1) post.likes.push(userId);
    else post.likes.splice(index, 1);

    await post.save();
    res.json(post);
  } catch (error) {
    console.error("Failed to like post:", error);
    res.status(500).json({ error: "Failed to like post" });
  }
};

const commentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.comments.push({ userId: req.user.id, text: req.body.text });
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error("Failed to comment:", error);
    res.status(500).json({ error: "Failed to comment" });
  }
};

const repost = async (req, res) => {
  try {
    const originalPost = await Post.findById(req.params.postId);
    if (!originalPost) return res.status(404).json({ error: "Post not found" });

    const reposted = await Post.create({
      userId: req.user.id,
      content: originalPost.content,
      image: originalPost.image,
    });
    res.status(201).json(reposted);
  } catch (error) {
    console.error("Failed to repost:", error);
    res.status(500).json({ error: "Failed to repost" });
  }
};

module.exports = {
  getFeed,
  createPost,
  likePost,
  commentPost,
  repost,
};
