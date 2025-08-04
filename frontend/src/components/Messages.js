import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000");

const Messages = () => {
  const { user } = useSelector((state) => state.user);
  const [receiverId, setReceiverId] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
      socket.on("receive_message", (msg) => {
        setMessages((prev) => [...prev, { ...msg, self: false }]);
      });
    }

    return () => {
      socket.off("receive_message");
    };
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!receiverId || !text.trim()) return;

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
    <div className="max-w-xl mx-auto mt-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">💬 Real-Time Messaging</h2>

      <input
        type="text"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
        placeholder="Enter receiver's user ID"
        className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div className="h-72 overflow-y-auto bg-gray-100 rounded-lg p-3 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.self ? "justify-end" : "justify-start"
            } transition-all`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                m.self
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white border border-gray-300 text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="text-sm">{m.text}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Messages;
