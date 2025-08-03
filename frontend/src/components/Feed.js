// 📁 src/components/Feed.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Feed = () => {
  const { token } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const topRef = useRef();

  const fetchFeed = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/posts/feed`, {
        headers: { Authorization: token },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("❌ Feed Fetch Error:", err);
      toast.error("Failed to load feed");
    }
  }, [API, token]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const handlePost = async () => {
    if (!content && !image) return toast.error("Post content or image required");
    setLoading(true);

    try {
      let imageUrl = "";
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const res = await axios.post(`${API}/upload/image`, formData, {
          headers: { Authorization: token },
        });
        imageUrl = res.data.url;
      }

      await axios.post(
        `${API}/posts`,
        { content, image: imageUrl },
        { headers: { Authorization: token } }
      );

      toast.success("Post created!");
      setContent("");
      setImage(null);
      setPreview("");
      fetchFeed();
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch {
      toast.error("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      await axios.put(`${API}/posts/like/${id}`, {}, {
        headers: { Authorization: token },
      });
      fetchFeed();
    } catch {
      toast.error("Error liking post");
    }
  };

  const handleComment = async (postId, comment) => {
    if (!comment) return;
    try {
      await axios.post(`${API}/posts/comment/${postId}`, { text: comment }, {
        headers: { Authorization: token },
      });
      fetchFeed();
    } catch {
      toast.error("Error commenting");
    }
  };

  const handleRepost = async (postId) => {
    try {
      await axios.post(`${API}/posts/repost/${postId}`, {}, {
        headers: { Authorization: token },
      });
      toast.success("Reposted!");
      fetchFeed();
    } catch {
      toast.error("Repost failed");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
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
      {/* Post Input */}
      <div className="bg-white p-4 shadow rounded mb-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full border p-2 rounded resize-none"
          rows={3}
        />
        <input type="file" onChange={handleImageChange} className="mt-2" accept="image/*" />
        {preview && <img src={preview} alt="preview" className="mt-2 max-h-64 rounded object-cover" />}
        <button
          onClick={handlePost}
          disabled={loading}
          className={`btn-primary mt-3 w-full ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center text-gray-500">No posts to show.</div>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="bg-white p-4 mb-4 rounded shadow">
            <div className="font-bold text-blue-700">{post.userId?.name}</div>
            <p className="my-2 whitespace-pre-wrap">{post.content}</p>
            {post.image && <img src={post.image} alt="Post" className="rounded max-h-72 object-cover my-2" />}
            <div className="flex gap-4 text-sm mt-2">
              <button onClick={() => handleLike(post._id)}>👍 {post.likes.length}</button>
              <button onClick={() => handleRepost(post._id)}>🔁 Repost</button>
            </div>

            {/* Comments */}
            <div className="mt-2">
              <CommentBox postId={post._id} handleComment={handleComment} />
              {post.comments.map((c, i) => (
                <div key={i} className="text-sm text-gray-600 mt-1">
                  💬 <span className="font-medium text-gray-800">{c.userId?.name || "User"}</span>: {c.text}
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
  return (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        className="border p-1 flex-1 rounded"
        placeholder="Comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="bg-gray-200 px-3 rounded"
        onClick={() => {
          handleComment(postId, text);
          setText("");
        }}
      >
        Send
      </button>
    </div>
  );
};

export default Feed;
