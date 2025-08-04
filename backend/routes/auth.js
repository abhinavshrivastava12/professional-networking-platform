// 📁 backend/routes/auth.js
const express = require("express");
const router = express.Router();

// Dummy login logic for test
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // In real app: validate from DB
  if (email === "test@example.com" && password === "123456") {
    return res.json({
      user: { name: "Test User", email },
      token: "mock-token-123",
    });
  }

  return res.status(401).json({ msg: "Invalid credentials" });
});

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  // Normally you'd save to DB here
  return res.status(201).json({
    user: { name, email },
    msg: "User registered successfully",
  });
});

module.exports = router;
