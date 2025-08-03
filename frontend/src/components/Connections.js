import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Connections = () => {
  const { user, token } = useSelector((state) => state.user);
  const [allUsers, setAllUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [pending, setPending] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const API = process.env.REACT_APP_API_URL;

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = useCallback(async () => {
    try {
      const usersRes = await axios.get(`${API}/users`, {
        headers: { Authorization: token },
      });
      setAllUsers(usersRes.data);

      const connRes = await axios.get(`${API}/connections/list`, {
        headers: { Authorization: token },
      });
      setConnections(connRes.data.map((u) => u._id));

      const pendingRes = await axios.get(`${API}/connections/pending`, {
        headers: { Authorization: token },
      });
      setPending(pendingRes.data.map((u) => u._id));
    } catch (err) {
      console.error("❌ Error fetching connections:", err);
      toast.error("Failed to load connections");
    }
  }, [API, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleConnect = async (toUserId) => {
    try {
      await axios.post(
        `${API}/connections/send`,
        { toUserId },
        { headers: { Authorization: token } }
      );
      toast.success("Connection request sent!");
      setPending((prev) => [...prev, toUserId]);
    } catch (err) {
      console.error("❌ Error sending request:", err);
      toast.error("Request failed");
    }
  };

  const filteredUsers = allUsers
    .filter((u) => u._id !== user._id)
    .filter((u) =>
      u.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

  const renderButton = (id) => {
    if (connections.includes(id)) return <span className="text-green-600">✅ Connected</span>;
    if (pending.includes(id)) return <span className="text-yellow-600">⏳ Pending</span>;
    return (
      <button
        onClick={() => handleConnect(id)}
        className="btn-secondary text-sm"
      >
        Connect
      </button>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="section-title">🔗 Connections</h2>
      <input
        type="text"
        value={search}
        placeholder="Search users..."
        onChange={(e) => setSearch(e.target.value)}
        className="input mb-4"
      />

      {filteredUsers.length === 0 ? (
        <p className="text-center text-gray-500">No users found</p>
      ) : (
        filteredUsers.map((u) => (
          <div
            key={u._id}
            className="bg-white rounded p-4 mb-3 shadow flex justify-between items-center"
          >
            <div>
              <h4 className="font-semibold">{u.name}</h4>
              <p className="text-sm text-gray-500">{u.email}</p>
            </div>
            {renderButton(u._id)}
          </div>
        ))
      )}
    </div>
  );
};

export default Connections;
