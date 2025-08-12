const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify JWT token and attach user to request
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token, access denied" });
    }

    // Extract token from header
    const token = authHeader.split(" ")[1];

    // Verify token using secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ msg: "Token verification failed" });
    }

    // Extract user ID from decoded token payload
    const userId = decoded.user?.id || decoded.id;

    // Find user in DB excluding password field
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // Attach user object to request for downstream middleware/controllers
    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Auth Middleware Error:", err.message);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

// Middleware to restrict access to admin users only
const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied, admin only" });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin };
