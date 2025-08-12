const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Application = require("../models/Application");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// POST /api/jobs - Admin only: Create new job
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { title, description, company, location, salary } = req.body;

    if (!title || !description || !company || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newJob = new Job({
      title,
      description,
      company,
      location,
      salary,
      postedBy: req.user.id,
    });

    await newJob.save();
    return res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (error) {
    console.error("Error posting job:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/jobs - Get all jobs, sorted latest first
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    return res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/jobs/:id - Get single job details
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    return res.status(200).json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/jobs/:id/apply - Apply for a job (Users only)
router.post("/:id/apply", verifyToken, async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admins cannot apply for jobs" });
    }

    const existingApplication = await Application.findOne({
      jobId,
      userId: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied" });
    }

    const application = new Application({
      jobId,
      userId: req.user.id,
      status: "Pending",
    });

    await application.save();
    return res.status(201).json({ message: "Applied successfully", application });
  } catch (error) {
    console.error("Error applying for job:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
