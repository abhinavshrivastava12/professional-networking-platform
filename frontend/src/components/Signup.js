import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
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
    <div className="max-w-md mx-auto mt-10 bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="input"
          name="name"
          placeholder="Full Name"
          value={userData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          className="input"
          name="email"
          placeholder="Email"
          value={userData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          className="input"
          name="password"
          placeholder="Password"
          value={userData.password}
          onChange={handleChange}
        />
        <button type="submit" className="btn-primary mt-2">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
