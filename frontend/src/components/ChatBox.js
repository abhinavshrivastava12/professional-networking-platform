import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";

const socket = io("http://localhost:5000"); // Or use ENV URL

const ChatBox = ({ receiverId }) => {
  const { user } = useSelector((state) => state.user);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Setup socket listeners
  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
    }

    socket.on("receive_message", (data) => {
      setMessages((prev) => [
        ...prev,
        { text: data.text, sender: "them", from: data.senderId },
      ]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [user._id]);

  // Send message
  const send = () => {
    if (!msg.trim()) return;
    const messageData = {
      senderId: user._id,
      receiverId,
      text: msg,
    };
    socket.emit("send_message", messageData);
    setMessages((prev) => [
      ...prev,
      { text: msg, sender: "me", from: user._id },
    ]);
    setMsg("");
  };

  return (
    <div className="border p-4 rounded max-w-md mx-auto bg-white shadow">
      <h2 className="text-xl font-semibold mb-3 text-center">💬 Chat</h2>

      <div className="h-64 overflow-y-auto bg-gray-100 p-3 rounded">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 ${
              m.sender === "me" ? "text-right text-blue-700" : "text-left text-gray-800"
            }`}
          >
            <div
              className={`inline-block px-3 py-1 rounded-lg ${
                m.sender === "me"
                  ? "bg-blue-100"
                  : "bg-gray-200"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 mt-3">
        <input
          className="border p-2 flex-1 rounded"
          placeholder="Type a message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          onClick={send}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
