// 📁 middleware/auth.js
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const rawHeader = req.header("Authorization");

  if (!rawHeader || !rawHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token, access denied" });
  }

  const token = rawHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Check whether decoded contains user object or just id
    const userId = decoded?.user?.id || decoded?.id;

    if (!userId) {
      return res.status(401).json({ msg: "Invalid token payload" });
    }

    req.user = { id: userId };
    console.log("✅ Authenticated user ID:", userId);

    next();
  } catch (err) {
    console.error("❌ Auth error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = auth;
