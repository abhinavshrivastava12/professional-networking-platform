const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

dotenv.config();

const seedUser = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@network.com";
    const employerEmail = "employer@network.com";

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Admin User",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log("✅ Admin user created");
    } else {
      console.log("🟡 Admin user already exists");
    }

    const existingEmployer = await User.findOne({ email: employerEmail });
    if (!existingEmployer) {
      const hashedPassword = await bcrypt.hash("employer123", 10);
      await User.create({
        name: "Employer User",
        email: employerEmail,
        password: hashedPassword,
        role: "employer",
      });
      console.log("✅ Employer user created");
    } else {
      console.log("🟡 Employer user already exists");
    }
  } catch (err) {
    console.error("❌ Seeding error:", err.stack || err);
  } finally {
    await mongoose.disconnect();
  }
};

seedUser();
