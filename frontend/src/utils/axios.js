import axios from "axios";

const api = axios.create({
  baseURL: "https://professional-networking-platform.onrender.com/api",
  timeout: 10000, // 10 seconds timeout (optional)
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("Could not read token from localStorage", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optionally: clear localStorage and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login"; // or use a router navigation if in React context
    }
    return Promise.reject(error);
  }
);

if (process.env.NODE_ENV === "development") {
  console.log("Stored token:", localStorage.getItem("token"));
}

export default api;
