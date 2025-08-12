const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");
const Post = require("../models/Post");
const Job = require("../models/Job");
const Message = require("../models/Message");

dotenv.config();

const seedAll = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany(),
      Post.deleteMany(),
      Job.deleteMany(),
      Message.deleteMany(),
    ]);
    console.log("🧹 Cleared existing data");

    const password = await bcrypt.hash("test123", 10);

    const users = await User.insertMany([
      { name: "Alice", email: "alice@test.com", password, role: "employer" },
      { name: "Bob", email: "bob@test.com", password, role: "user" },
      { name: "Charlie", email: "charlie@test.com", password, role: "employer" },
    ]);
    console.log("✅ Users seeded");

    await Post.insertMany([
      { userId: users[0]._id, content: "Excited to join this platform!" },
      { userId: users[1]._id, content: "Looking for React dev roles!" },
    ]);
    console.log("✅ Posts seeded");

    await Job.insertMany([
      {
        title: "Frontend Developer",
        description: "React, Tailwind, API integration",
        skills: ["React", "Tailwind", "REST API"],
        location: "Remote",
        postedBy: users[0]._id,
      },
      {
        title: "Backend Developer",
        description: "Node.js, MongoDB, Express",
        skills: ["Node.js", "MongoDB", "Express"],
        location: "Bangalore",
        postedBy: users[2]._id,
      },
    ]);
    console.log("✅ Jobs seeded");

    await Message.insertMany([
      { senderId: users[0]._id, receiverId: users[1]._id, text: "Hi Bob!" },
      { senderId: users[1]._id, receiverId: users[0]._id, text: "Hey Alice!" },
    ]);
    console.log("✅ Messages seeded");

    console.log("🎉 All data seeded successfully");
  } catch (err) {
    console.error("❌ Seeding failed:", err.stack || err);
  } finally {
    await mongoose.disconnect();
  }
};

seedAll();
