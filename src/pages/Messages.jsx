import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Send, CalendarPlus } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, doc, updateDoc } from "firebase/firestore";
import "../styles/MessagesPage.css";

export default function Messages() {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const chatWindowRef = useRef(null);

  // Effect to fetch user's conversations
  useEffect(() => {
    if (!currentUser) return;
    setLoadingConvos(true);
    const q = query(collection(db, "conversations"), where("participants", "array-contains", currentUser.uid));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const convosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Get the other participant's info
        otherUserName: doc.data().participantNames.find(name => name !== currentUser.displayName),
        otherUserAvatar: doc.data().participantAvatars.find(avatar => avatar !== currentUser.photoURL),
      }));
      setConversations(convosData);
      setLoadingConvos(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Effect to fetch messages for the active chat
  useEffect(() => {
    if (!activeChat) return;
    setLoadingMessages(true);
    const messagesRef = collection(db, "conversations", activeChat.id, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesData);
      setLoadingMessages(false);
    });
    return () => unsubscribe();
  }, [activeChat]);

  // Auto-scroll to bottom of chat window
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !activeChat) return;

    const messageText = newMessage;
    setNewMessage("");

    // Add new message to the 'messages' subcollection
    const messagesRef = collection(db, "conversations", activeChat.id, "messages");
    await addDoc(messagesRef, {
      text: messageText,
      senderId: currentUser.uid,
      createdAt: serverTimestamp(),
    });

    // Update the lastMessage on the conversation document
    const convoRef = doc(db, "conversations", activeChat.id);
    await updateDoc(convoRef, {
        lastMessage: messageText,
        lastTimestamp: serverTimestamp(),
    });
  };

  return (
    <div className="messages-page-container">
      <Sidebar />
      <main className="messages-main-content main-content-area">
        <div className="conversations-panel">
          <div className="panel-header"><h2>Chats</h2></div>
          <div className="conversations-list">
            {loadingConvos ? (<p>Loading chats...</p>) : (
              conversations.map((convo) => (
                <div
                  key={convo.id}
                  className={`conversation-item ${activeChat?.id === convo.id ? "active" : ""}`}
                  onClick={() => setActiveChat(convo)}
                >
                  <div className="convo-avatar-wrapper">
                    <img src={convo.otherUserAvatar} alt={convo.otherUserName} className="convo-avatar" />
                    {/* Add online status logic here if needed */}
                  </div>
                  <div className="convo-details">
                    <div className="convo-header">
                      <span className="convo-name">{convo.otherUserName}</span>
                      <span className="convo-timestamp">{convo.lastTimestamp?.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="convo-last-message">{convo.lastMessage}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="chat-panel">
          {activeChat ? (
            <>
              <header className="chat-header">
                <div className="chat-header-info">
                  <img src={activeChat.otherUserAvatar} alt={activeChat.otherUserName} className="chat-avatar" />
                  <div>
                    <h3>{activeChat.otherUserName}</h3>
                    <p className="chat-topic">Topic: {activeChat.topic}</p>
                  </div>
                </div>
                <button className="schedule-btn"><CalendarPlus size={20}/> Schedule Session</button>
              </header>

              <div className="chat-window" ref={chatWindowRef}>
                {loadingMessages ? (<p>Loading messages...</p>) : (
                    messages.map((msg) => (
                    <div key={msg.id} className={`chat-bubble-wrapper ${msg.senderId === currentUser.uid ? 'me' : 'other'}`}>
                        <div className="chat-bubble">{msg.text}</div>
                    </div>
                    ))
                )}
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

