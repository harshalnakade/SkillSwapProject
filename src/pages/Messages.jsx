import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Send, CalendarPlus } from 'lucide-react';
import "../styles/MessagesPage.css";

// Mock data now includes online status and conversation topic
const initialConversations = [
  {
    id: 1,
    name: "Santoshi Patil",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Santoshi",
    topic: "Acoustic Guitar Mastery",
    isOnline: true,
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
    topic: "Data Science with Python",
    isOnline: false,
    lastMessage: "I've pushed the latest code.",
    timestamp: "Yesterday",
    messages: [
      { id: 1, sender: "me", text: "Hey Rahul, can you check the latest pull request?" },
      { id: 2, sender: "other", text: "Sure, taking a look now." },
      { id: 3, sender: "other", text: "Looks good. I've pushed the latest code." },
    ],
  },
];

export default function Messages() {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeChatId, setActiveChatId] = useState(1);
  const [newMessage, setNewMessage] = useState("");
  const chatWindowRef = useRef(null);

  const activeChat = conversations.find(c => c.id === activeChatId);
  
  // Auto-scroll to bottom of chat window
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [activeChat, conversations]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    
    const newMsg = {
        id: Date.now(), // Use a unique ID
        sender: "me",
        text: newMessage,
    };

    // Update the state to make the chat interactive
    setConversations(prevConvos => 
        prevConvos.map(convo => 
            convo.id === activeChatId
            ? { ...convo, messages: [...convo.messages, newMsg], lastMessage: newMessage, timestamp: "Now" }
            : convo
        )
    );
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
                <div className="convo-avatar-wrapper">
                  <img src={convo.avatar} alt={convo.name} className="convo-avatar" />
                  {convo.isOnline && <div className="online-indicator"></div>}
                </div>
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
                <div className="chat-header-info">
                  <div className="convo-avatar-wrapper">
                    <img src={activeChat.avatar} alt={activeChat.name} className="chat-avatar" />
                    {activeChat.isOnline && <div className="online-indicator"></div>}
                  </div>
                  <div>
                    <h3>{activeChat.name}</h3>
                    <p className="chat-topic">Topic: {activeChat.topic}</p>
                  </div>
                </div>
                <button className="schedule-btn"><CalendarPlus size={20}/> Schedule Session</button>
              </header>

              <div className="chat-window" ref={chatWindowRef}>
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
                <button type="submit" className="send-button"><Send size={20}/></button>
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
