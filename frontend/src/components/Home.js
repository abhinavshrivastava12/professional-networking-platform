import React from "react";
import { Link } from "react-router-dom";
import { Users, Briefcase, FileText, MessageCircle } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Hero Section with Background Image and Animation */}
      <section
        className="relative text-center py-24 px-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?fit=crop&w=1350&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/60 dark:bg-black/70 animate-fadeIn" />
        <div className="relative z-10 p-10 rounded-lg max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-4 text-white">
            Welcome to <span className="text-blue-400">Global_Connect</span>
          </h2>
          <p className="text-lg text-gray-200 mb-6">
            A platform where Abhinav Shrivastava, Ritesh Tiwari, Yashveer Singh, Manu Omar, and Nitesh Yadav built a project connecting professionals across the globe.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition"
          >
            🚀 Join Now
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-6">
        <h3 className="text-3xl font-bold text-center mb-12">Our Services</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <Link to="/connections">
            <ServiceCard
              icon={<Users size={40} />}
              title="Professional Networking"
              description="Connect with professionals in your field and grow your network."
            />
          </Link>
          <Link to="/jobs">
            <ServiceCard
              icon={<Briefcase size={40} />}
              title="Job Board"
              description="Explore job opportunities or post jobs to find the right candidates."
            />
          </Link>
          <Link to="/feed">
            <ServiceCard
              icon={<FileText size={40} />}
              title="Post & Engage"
              description="Share your thoughts and achievements. Like, comment and repost."
            />
          </Link>
          <Link to="/messages">
            <ServiceCard
              icon={<MessageCircle size={40} />}
              title="Real-Time Chat"
              description="Chat instantly with your network in real-time."
            />
          </Link>
        </div>
      </section>
    </div>
  );
};

const ServiceCard = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-lg transition-all text-center">
    <div className="text-blue-600 dark:text-blue-400 mb-4 flex justify-center">{icon}</div>
    <h4 className="text-xl font-semibold mb-2">{title}</h4>
    <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
  </div>
);

export default Home;
