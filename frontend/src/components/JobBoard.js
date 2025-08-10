// client/src/components/JobBoard.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("/api/jobs");
        setJobs(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load jobs. Please try again.");
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <p className="text-center mt-4">Loading jobs...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-4">{error}</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Job Listings</h2>
      {jobs.length === 0 ? (
        <p>No jobs available at the moment.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="border rounded-lg shadow p-4 hover:shadow-lg transition duration-200"
            >
              <h3 className="text-xl font-semibold">{job.title}</h3>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-sm text-gray-500">{job.location}</p>
              <p className="mt-2 text-gray-700">{job.description}</p>
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Apply Now
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobBoard;
