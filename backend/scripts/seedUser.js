// seeduser.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();
connectDB();

const seedAdminUser = async () => {
  try {
    const existing = await User.findOne({ email: "admin@network.com" });
    if (existing) {
      console.log("🟡 Admin already exists");
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin = new User({
      name: "Admin User",
      email: "admin@network.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin user created");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedAdminUser();
