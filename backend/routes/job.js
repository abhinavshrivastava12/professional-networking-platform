// backend/routes/job.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  postJob,
  getAllJobs,
  applyToJob,
  saveJob,
  getSavedJobs
} = require("../controllers/jobController");

/**
 * @route   POST /api/jobs
 * @desc    Post a new job (only for logged-in users)
 * @access  Private
 */
router.post("/", auth, postJob);

/**
 * @route   GET /api/jobs
 * @desc    Get all jobs (public access)
 * @access  Public
 */
router.get("/", getAllJobs);

/**
 * @route   POST /api/jobs/apply/:jobId
 * @desc    Apply to a specific job
 * @access  Private
 */
router.post("/apply/:jobId", auth, applyToJob);

/**
 * @route   PUT /api/jobs/save/:jobId
 * @desc    Save a specific job
 * @access  Private
 */
router.put("/save/:jobId", auth, saveJob);

/**
 * @route   GET /api/jobs/saved
 * @desc    Get all saved jobs for the logged-in user
 * @access  Private
 */
router.get("/saved", auth, getSavedJobs);

module.exports = router;
