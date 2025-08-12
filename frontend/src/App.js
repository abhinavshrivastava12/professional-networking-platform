import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { loginUserSuccess } from "./store/userSlice";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import About from "./components/About";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserProfile from "./components/UserProfile";
import Connections from "./components/Connections";
import Feed from "./components/Feed";
import JobBoard from "./components/JobBoard";
import ChatBox from "./components/ChatBox";
import Messages from "./components/Messages";
import ProtectedRoute from "./components/ProtectedRoute";

// Socket connection
import socket from "./utils/socket";

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // 🔐 Restore login from localStorage on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        dispatch(loginUserSuccess({ token, user: JSON.parse(userData) }));
      } catch (err) {
        console.error("❌ Error restoring user from localStorage", err);
      }
    }
  }, [dispatch]);

  // 🔌 Join socket room after login
  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
      console.log("✅ Joined socket room:", user._id);
    }
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors">
      <Header />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/feed" replace />}
          />
          <Route
            path="/signup"
            element={!user ? <Signup /> : <Navigate to="/feed" replace />}
          />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/connections"
            element={
              <ProtectedRoute>
                <Connections />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <JobBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatBox />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
