const express = require("express");
const router = express.Router();

// Mock users DB (in-memory) for demonstration (optional)
const users = [];

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Missing email or password" });
  }

  // Find user in mock DB
  const user = users.find(u => u.email === email);

  // Mock password check
  if (!user || user.password !== password) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }

  // Mock JWT token generation (replace with real JWT in production)
  const token = "mock-token-123";

  res.status(200).json({
    user: { name: user.name, email: user.email },
    token,
  });
});

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  // Check if email already exists
  if (users.some(u => u.email === email)) {
    return res.status(409).json({ msg: "Email already registered" });
  }

  // Save user to mock DB
  users.push({ name, email, password });

  res.status(201).json({
    user: { name, email },
    msg: "User registered successfully",
  });
});

module.exports = router;
