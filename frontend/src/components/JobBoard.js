import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
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
    location: ""
  });

  const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  // ✅ Optimized fetch function
  const fetchJobs = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/jobs`, {
        headers: { Authorization: token },
      });
      setJobs(res.data);

      const saved = await axios.get(`${API}/jobs/saved`, {
        headers: { Authorization: token },
      });
      setSavedJobs(saved.data.map((j) => j._id));
    } catch {
      toast.error("Error loading jobs");
    }
  }, [API, token]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePost = async () => {
    try {
      const jobData = {
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()),
      };

      await axios.post(`${API}/jobs`, jobData, {
        headers: { Authorization: token },
      });

      toast.success("Job posted");
      setFormData({ title: "", description: "", skills: "", location: "" });
      fetchJobs();
    } catch {
      toast.error("Error posting job");
    }
  };

  const handleApply = async (jobId) => {
    try {
      const res = await axios.post(`${API}/jobs/apply/${jobId}`, {}, {
        headers: { Authorization: token },
      });
      toast.success(res.data.msg);
      fetchJobs();
    } catch (err) {
      toast.error(err.response.data.msg || "Failed to apply");
    }
  };

  const handleSave = async (jobId) => {
    try {
      const res = await axios.put(`${API}/jobs/save/${jobId}`, {}, {
        headers: { Authorization: token },
      });
      toast.success(res.data.msg);
      fetchJobs();
    } catch {
      toast.error("Error saving job");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Post a Job</h2>
      <div className="bg-white p-4 rounded shadow mb-6 space-y-3">
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
        <button className="btn-primary" onClick={handlePost}>
          Post Job
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">Job Listings</h2>
      {jobs.map((job) => {
        const isApplied = job.applicants.includes(user._id);
        const isSaved = savedJobs.includes(job._id);

        return (
          <div key={job._id} className="bg-white p-4 rounded shadow mb-4">
            <h3 className="text-lg font-bold">{job.title}</h3>
            <p className="mb-1">{job.description}</p>
            <p className="text-sm text-gray-600">Location: {job.location}</p>
            <p className="text-sm text-gray-600 mb-2">Skills: {job.skills.join(", ")}</p>

            <div className="flex gap-2 flex-wrap mt-2">
              <button
                className={`px-3 py-1 rounded text-white ${isApplied ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
                onClick={() => handleApply(job._id)}
                disabled={isApplied}
              >
                {isApplied ? "Applied" : "Apply"}
              </button>

              <button
                className={`px-3 py-1 rounded text-white ${isSaved ? "bg-yellow-400" : "bg-yellow-500 hover:bg-yellow-600"}`}
                onClick={() => handleSave(job._id)}
              >
                {isSaved ? "Saved" : "Save Job"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JobBoard;
