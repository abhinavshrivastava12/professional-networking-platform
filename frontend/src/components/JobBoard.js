// src/pages/JobBoard.js
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Backend API ka base URL
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  // Jobs fetch karne ka function, useCallback se wrap kiya hai taaki useEffect me stable reference mile
  const fetchJobs = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/jobs`);
      setJobs(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch jobs");
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);  // fetchJobs ko dependency array me daala

  if (loading) return <p className="text-center mt-5">Loading jobs...</p>;
  if (error) return <p className="text-center text-red-500 mt-5">{error}</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>
      {jobs.length === 0 ? (
        <p>No jobs available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">{job.title}</h2>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-gray-500 text-sm">{job.location}</p>
              <p className="mt-2">{job.description}</p>
              <p className="mt-2 font-semibold text-green-600">
                Salary: {job.salary || "Not specified"}
              </p>
              <p className="text-sm mt-1 text-gray-500">
                Posted on: {new Date(job.createdAt).toLocaleDateString()}
              </p>
              <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobBoard;
