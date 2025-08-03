import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please enter both email and password");
    }

    try {
      const res = await dispatch(loginUser({ email, password })).unwrap();
      toast.success(`Welcome, ${res.user.name}!`);
      navigate("/feed");
    } catch (err) {
      toast.error(err || "Login failed. Check credentials.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow p-6 rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn-primary mt-2">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
