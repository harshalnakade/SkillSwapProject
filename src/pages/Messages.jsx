// src/pages/Messages.jsx

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/MessagesPage.css";

// Expanded mock data for a more realistic chat interface
const conversationsData = [
  {
    id: 1,
    name: "Santoshi Patil",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Santoshi",
    lastMessage: "Sounds great! See you then.",
    timestamp: "10:42 AM",
    messages: [
      { id: 1, sender: "other", text: "Hey Harshal! Are we still on for the guitar session tomorrow?" },
      { id: 2, sender: "me", text: "Hey Santoshi! Absolutely. I'm looking forward to it." },
      { id: 3, sender: "other", text: "Sounds great! See you then." },
    ],
  },
  {
    id: 2,
    name: "Rahul Singh",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    lastMessage: "I've pushed the latest code.",
    timestamp: "Yesterday",
    messages: [
      { id: 1, sender: "me", text: "Hey Rahul, can you check the latest pull request?" },
      { id: 2, sender: "other", text: "Sure, taking a look now." },
      { id: 3, sender: "other", text: "Looks good. I've pushed the latest code." },
    ],
  },
  {
    id: 3,
    name: "Maria Garcia",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    lastMessage: "¡Hola! ¿Cómo estás?",
    timestamp: "31/08/2025",
    messages: [
        { id: 1, sender: "other", text: "¡Hola! ¿Cómo estás?" }
    ],
  },
];

export default function Messages() {
  const [conversations] = useState(conversationsData);
  const [activeChatId, setActiveChatId] = useState(1); // Default to the first chat
  const [newMessage, setNewMessage] = useState("");

  const activeChat = conversations.find(c => c.id === activeChatId);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    
    // In a real app, you would update the state and send this to a server
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  return (
    <div className="messages-page-container">
      <Sidebar />
      <main className="messages-main-content">
        {/* Left Panel: Conversations List */}
        <div className="conversations-panel">
          <div className="panel-header">
            <h2>Chats</h2>
          </div>
          <div className="conversations-list">
            {conversations.map((convo) => (
              <div
                key={convo.id}
                className={`conversation-item ${convo.id === activeChatId ? "active" : ""}`}
                onClick={() => setActiveChatId(convo.id)}
              >
                <img src={convo.avatar} alt={convo.name} className="convo-avatar" />
                <div className="convo-details">
                  <div className="convo-header">
                    <span className="convo-name">{convo.name}</span>
                    <span className="convo-timestamp">{convo.timestamp}</span>
                  </div>
                  <p className="convo-last-message">{convo.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Active Chat Window */}
        <div className="chat-panel">
          {activeChat ? (
            <>
              <header className="chat-header">
                <img src={activeChat.avatar} alt={activeChat.name} className="chat-avatar" />
                <h3>{activeChat.name}</h3>
              </header>

              <div className="chat-window">
                {activeChat.messages.map((msg) => (
                  <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender}`}>
                    <div className="chat-bubble">{msg.text}</div>
                  </div>
                ))}
              </div>

              <form className="chat-input-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  className="chat-input"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="send-button">Send</button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              <p>Select a conversation to start chatting.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}