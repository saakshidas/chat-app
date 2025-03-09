import React, { useState, useEffect } from "react";
import socket from "../socket";
import axios from "axios";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/messages")
      .then(res => setMessages(res.data.reverse()));

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const msgData = { username: "User", message };
      socket.emit("sendMessage", msgData);
      axios.post("http://localhost:5000/messages", msgData);
      setMessage("");
    }
  };

  return (
    <>
    <div className="p-4 max-w-md mx-auto">
      <div className="h-64 overflow-y-auto border p-2">
        {messages.map((msg, index) => (
          <p key={index} className="bg-blue-100 p-1 rounded my-1">
            <b>{msg.username}:</b> {msg.message}
          </p>
        ))}
      </div>
      <input
        className="border p-2 w-full"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button className="bg-blue-500 text-white p-2 mt-2 w-full" onClick={sendMessage}>
        Send
      </button>
    </div>
    </>
  );
};

export default Chat;
