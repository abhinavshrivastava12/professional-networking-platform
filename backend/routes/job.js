// server/routes/job.js

const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const jwt = require("jsonwebtoken");

// Middleware to verify token
function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mock-secret");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
}

// 📌 Create a new job
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title, description, company, location } = req.body;

    if (!title || !description || !company || !location) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const newJob = new Job({
      title,
      description,
      company,
      location,
      postedBy: req.user.id, // from token
    });

    await newJob.save();
    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 📌 Get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 📌 Get a single job by ID
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 📌 Update a job
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({ message: "Job updated successfully", job: updatedJob });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 📌 Delete a job
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
