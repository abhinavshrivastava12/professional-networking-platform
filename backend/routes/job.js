const express = require("express");
const {
  postJob,
  getAllJobs,
  applyToJob,
  saveJob,
  getSavedJobs
} = require("../controllers/jobController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", auth, postJob); // Post job
router.get("/", getAllJobs); // View jobs
router.post("/:jobId/apply", auth, applyToJob); // Apply job
router.post("/:jobId/save", auth, saveJob); // Save/Unsave
router.get("/saved", auth, getSavedJobs); // View saved

module.exports = router;
