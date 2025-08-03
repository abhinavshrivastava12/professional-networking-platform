import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000");

const Messages = () => {
  const { user } = useSelector((state) => state.user);
  const [receiverId, setReceiverId] = useState(""); // 👈 Input receiver manually for now
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);

      socket.on("receive_message", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }

    return () => {
      socket.off("receive_message");
    };
  }, [user]);

  const sendMessage = () => {
    if (!receiverId || !text) return;

    const data = {
      senderId: user._id,
      receiverId,
      text,
    };

    socket.emit("send_message", data);
    setMessages((prev) => [...prev, { ...data, self: true }]);
    setText("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">💬 Real-Time Messages</h2>

      <input
        type="text"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
        placeholder="Enter receiver userId"
        className="input mb-2"
      />
      <div className="border p-4 rounded h-64 overflow-y-auto bg-gray-50 mb-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`text-sm mb-1 ${m.self ? "text-right text-blue-600" : "text-left text-gray-800"}`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          className="flex-1 border rounded p-2"
        />
        <button className="btn-primary" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Messages;
