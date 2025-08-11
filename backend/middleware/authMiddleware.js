const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ✅ Token verify karne ka middleware
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token, access denied" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ msg: "Token verification failed" });
    }

    const userId = decoded.user?.id || decoded.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Auth Middleware Error:", err.message);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

// ✅ Sirf Admin ke liye access
const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied, admin only" });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin };
