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

router.post("/", auth, postJob);          // Post a job (only logged in)
router.get("/", getAllJobs);              // Public jobs list
router.post("/apply/:jobId", auth, applyToJob);
router.put("/save/:jobId", auth, saveJob);
router.get("/saved", auth, getSavedJobs);

module.exports = router;
