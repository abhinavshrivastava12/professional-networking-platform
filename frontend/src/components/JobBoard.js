// src/pages/JobBoard.js

import React, { useState, useEffect, useCallback } from "react";
import api from "../utils/axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const JobBoard = () => {
  const { user, token } = useSelector((state) => state.user);
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    location: "",
  });

  // ✅ Fetch all jobs + saved jobs
  const fetchJobs = useCallback(async () => {
    try {
      const res = await api.get("/jobs", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ FIXED
      });
      setJobs(res.data);

      const saved = await api.get("/jobs/saved", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ FIXED
      });
      setSavedJobs(saved.data.map((j) => j._id));
    } catch (err) {
      toast.error("Error loading jobs");
      console.error("❌ Job fetch error:", err);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchJobs();
  }, [fetchJobs, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ Post new job
  const handlePost = async () => {
    try {
      const jobData = {
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()),
      };

      await api.post("/jobs", jobData, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ FIXED
      });

      toast.success("✅ Job posted!");
      setFormData({ title: "", description: "", skills: "", location: "" });
      fetchJobs();
    } catch (err) {
      toast.error("Error posting job");
      console.error("❌ Job post error:", err);
    }
  };

  const handleApply = async (jobId) => {
    try {
      const res = await api.post(`/jobs/apply/${jobId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ FIXED
      });
      toast.success(res.data.msg || "Applied!");
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Failed to apply");
      console.error("❌ Apply error:", err);
    }
  };

  const handleSave = async (jobId) => {
    try {
      const res = await api.put(`/jobs/save/${jobId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ FIXED
      });
      toast.success(res.data.msg || "Saved!");
      fetchJobs();
    } catch (err) {
      toast.error("Error saving job");
      console.error("❌ Save error:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Job Post Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">🚀 Post a Job</h2>
        <div className="grid gap-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Job Title"
            className="input"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Job Description"
            rows={3}
            className="input"
          />
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="Skills (comma separated)"
            className="input"
          />
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="input"
          />
          <button
            onClick={handlePost}
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
          >
            ➕ Post Job
          </button>
        </div>
      </div>

      {/* Job Listings */}
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">💼 Job Listings</h2>
      {jobs.length === 0 ? (
        <p className="text-gray-500 text-center">No jobs available.</p>
      ) : (
        jobs.map((job) => {
          const isApplied = job.applicants.includes(user._id);
          const isSaved = savedJobs.includes(job._id);

          return (
            <div
              key={job._id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow p-5 mb-4 transition hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-400 mb-1">
                {job.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">{job.description}</p>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                📍 Location: <span className="font-medium">{job.location}</span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                🛠️ Skills:{" "}
                <span className="text-gray-800 dark:text-gray-200">
                  {job.skills.join(", ")}
                </span>
              </div>

              <div className="flex gap-3 mt-4 flex-wrap">
                <button
                  disabled={isApplied}
                  onClick={() => handleApply(job._id)}
                  className={`px-4 py-1 rounded font-medium transition text-white ${
                    isApplied
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isApplied ? "✅ Applied" : "Apply Now"}
                </button>
                <button
                  onClick={() => handleSave(job._id)}
                  className={`px-4 py-1 rounded font-medium transition text-white ${
                    isSaved
                      ? "bg-yellow-400"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  }`}
                >
                  {isSaved ? "⭐ Saved" : "Save Job"}
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default JobBoard;
