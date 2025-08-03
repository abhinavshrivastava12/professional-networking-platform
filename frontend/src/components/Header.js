import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/userSlice";
import { Moon, Sun, Bell, UserCircle } from "lucide-react";

const Header = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  useEffect(() => {
    setMobileOpen(false);
    setShowProfile(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
  };

  const navLinks = [
    { to: "/", text: "Home" },
    { to: "/about", text: "About" },
    { to: "/services", text: "Services" },
    { to: "/contact", text: "Contact" },
    { to: "/feed", text: "Feed" },
    { to: "/jobs", text: "Jobs" },
    { to: "/connections", text: "Connections" },
    { to: "/messages", text: "Chat" },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Global_Connect
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700 dark:text-gray-200">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="hover:text-blue-600 transition">
              {link.text}
            </Link>
          ))}

          <button className="relative">
            <Bell size={20} className="hover:text-blue-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1">
              3
            </span>
          </button>

          {user ? (
            <div className="relative">
              <button
                className="flex items-center gap-1 hover:text-blue-600"
                onClick={() => setShowProfile(!showProfile)}
              >
                <UserCircle size={22} />
              </button>
              {showProfile && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded shadow z-10 text-sm">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600">Login</Link>
              <Link to="/signup" className="hover:text-blue-600">Signup</Link>
            </>
          )}

          <button onClick={() => setDark(!dark)} className="ml-3">
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-gray-700 dark:text-gray-200">
          ☰
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden px-4 py-3 space-y-2 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="block hover:text-blue-600">
              {link.text}
            </Link>
          ))}
          {user ? (
            <>
              <Link to="/profile" className="block hover:text-blue-600">Profile</Link>
              <button onClick={handleLogout} className="text-red-500 hover:underline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block hover:text-blue-600">Login</Link>
              <Link to="/signup" className="block hover:text-blue-600">Signup</Link>
            </>
          )}
          <button onClick={() => setDark(!dark)} className="block">
            {dark ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
