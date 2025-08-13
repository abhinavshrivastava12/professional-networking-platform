import React, { useState, useEffect, useCallback, useRef } from "react";
import api from "../utils/axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Feed = () => {
  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingPosts, setFetchingPosts] = useState(false);

  const topRef = useRef();

  // Setup 401 interceptor only once (on mount)
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
        }
        return Promise.reject(err);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, [navigate]);

  // Fetch posts from backend
  const fetchFeed = useCallback(async () => {
    if (!token) return;

    setFetchingPosts(true);
    try {
      // Pass token per request instead of global header
      const res = await api.get("/posts/feed", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data || []);
    } catch (err) {
      console.error("❌ Feed Fetch Error:", err);
      toast.error("Failed to load feed");
    } finally {
      setFetchingPosts(false);
    }
  }, [token]);

  // Fetch posts on token change
  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // Handle post submission with optional image upload
  const handlePost = async () => {
    if (!content.trim() && !image) {
      return toast.error("Post content or image required");
    }
    setLoading(true);

    try {
      let imageUrl = "";

      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const res = await api.post("/upload/image", formData, {
          headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        imageUrl = res.data.url;
      }

      await api.post(
        "/posts",
        { content: content.trim(), image: imageUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("🎉 Post created!");
      setContent("");
      setImage(null);
      setPreview("");
      fetchFeed();
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Post Error:", err);
      toast.error("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  // Like post handler
  const handleLike = async (id) => {
    try {
      await api.put(`/posts/like/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFeed();
    } catch (err) {
      console.error("Like error:", err);
      toast.error("Error liking post");
    }
  };

  // Comment post handler
  const handleComment = async (postId, comment) => {
    if (!comment.trim()) return;
    try {
      await api.post(
        `/posts/comment/${postId}`,
        { text: comment.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFeed();
    } catch (err) {
      console.error("Comment error:", err);
      toast.error("Error commenting");
    }
  };

  // Repost handler
  const handleRepost = async (postId) => {
    try {
      await api.post(
        `/posts/repost/${postId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("🔁 Reposted!");
      fetchFeed();
    } catch (err) {
      console.error("Repost error:", err);
      toast.error("Repost failed");
    }
  };

  // Handle image input change & set preview (with cleanup)
  useEffect(() => {
    // Cleanup previous preview URL on unmount or when preview changes
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (preview) URL.revokeObjectURL(preview);
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      if (preview) URL.revokeObjectURL(preview);
      setImage(null);
      setPreview("");
    }
  };

  if (!token) {
    return (
      <div className="text-center mt-20 text-red-600 font-semibold">
        🔐 Please login to view the feed.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div ref={topRef} />

      {/* ➕ Create Post */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg p-4 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          rows={3}
          maxLength={1000}
          disabled={loading}
        />
        <input
          type="file"
          onChange={handleImageChange}
          className="mt-3"
          accept="image/*"
          disabled={loading}
          aria-label="Upload an image for your post"
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-3 max-h-64 w-full object-cover rounded-lg shadow-md"
          />
        )}
        <button
          onClick={handlePost}
          disabled={loading}
          className={`mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-transform active:scale-95 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
          aria-disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>

      {/* 📝 Posts List */}
      {fetchingPosts ? (
        <div className="text-center text-gray-500 mt-10">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">No posts to show.</div>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md mb-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-indigo-700 dark:text-indigo-400 text-lg">
                {post.userId?.name || "Unknown User"}
              </div>
            </div>

            <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap mb-3">
              {post.content}
            </p>

            {post.image && (
              <img
                src={post.image}
                alt={`Post by ${post.userId?.name || "user"}`}
                className="rounded-lg max-h-72 w-full object-cover mb-4 shadow-sm"
              />
            )}

            <div className="flex gap-6 text-gray-600 dark:text-gray-300 text-sm mb-4">
              <button
                onClick={() => handleLike(post._id)}
                className="flex items-center gap-1 hover:text-indigo-600 transition"
                aria-label={`Like post by ${post.userId?.name || "user"}`}
              >
                👍 <span>{post.likes?.length || 0}</span>
              </button>

              <button
                onClick={() => handleRepost(post._id)}
                className="flex items-center gap-1 hover:text-indigo-600 transition"
                aria-label="Repost this post"
              >
                🔁 Repost
              </button>
            </div>

            {/* 💬 Comments */}
            <CommentBox postId={post._id} handleComment={handleComment} />
            <div className="mt-3 space-y-2 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-200">
              {post.comments.map((c, i) => (
                <div
                  key={i}
                  className="text-gray-700 dark:text-gray-200 text-sm border border-gray-100 dark:border-gray-700 p-2 rounded-lg bg-gray-50 dark:bg-gray-900"
                >
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {c.userId?.name || "User"}
                  </span>
                  : {c.text}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const CommentBox = ({ postId, handleComment }) => {
  const [text, setText] = useState("");

  // Submit comment handler
  const submitComment = () => {
    if (!text.trim()) return;
    handleComment(postId, text.trim());
    setText("");
  };

  return (
    <div className="flex gap-3 mt-3">
      <input
        type="text"
        className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        placeholder="Add a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submitComment();
        }}
        aria-label="Add a comment"
      />
      <button
        onClick={submitComment}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg px-4 py-2 shadow-md transition-transform active:scale-95"
        aria-label="Send comment"
      >
        Send
      </button>
    </div>
  );
};

export default Feed;
