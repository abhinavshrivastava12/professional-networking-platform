import React from "react";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Professional Networking",
      desc: "Connect with professionals in your field and grow your network.",
      path: "/connections",
    },
    {
      title: "Job Board",
      desc: "Explore job opportunities or post jobs to find the right candidates.",
      path: "/jobs", // Make sure this route exists
    },
    {
      title: "Post & Engage",
      desc: "Share your thoughts and achievements. Like, comment and repost.",
      path: "/feed", // Adjust to actual feed route
    },
    {
      title: "Real-Time Chat",
      desc: "Chat instantly with your network in real-time.",
      path: "/chat", // Adjust to your chat route
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Our Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow hover:shadow-md transition"
          >
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              {service.title}
            </h3>
            <p className="text-gray-600 mb-4">{service.desc}</p>
            <button
              className="btn-primary"
              onClick={() => navigate(service.path)}
            >
              Go
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
