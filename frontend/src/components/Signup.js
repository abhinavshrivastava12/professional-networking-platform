import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/userSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = userData;

    if (!name || !email || !password) {
      return toast.error("All fields are required");
    }

    try {
      await dispatch(registerUser(userData)).unwrap();
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8 animate-fadeIn">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={userData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
