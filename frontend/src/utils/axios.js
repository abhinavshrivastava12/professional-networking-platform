// ✅ src/utils/axios.js
import axios from "axios";

// 🔁 Replace with your actual backend Render URL
const BASE_URL = "https://professional-networking-platform.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
