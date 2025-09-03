import { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Send, CalendarPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";
import "../styles/MessagesPage.css";

export default function MessagesPage() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const chatWindowRef = useRef(null);

  // === Effect 1: Fetch Conversations ===
  useEffect(() => {
    if (!currentUser) return;
    setLoadingConvos(true);

    const q = query(
      collection(db, "conversations"),
      where("participants", "array-contains", currentUser.uid),
      orderBy("lastTimestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const convosData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const otherUserIndex = data.participants.findIndex(
          (uid) => uid !== currentUser.uid
        );
        return {
          id: doc.id,
          ...data,
          otherUserName: data.participantNames?.[otherUserIndex] || "Unknown",
          otherUserAvatar:
            data.participantAvatars?.[otherUserIndex] ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.id}`,
        };
      });

      setConversations(convosData);
      setLoadingConvos(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // === Effect 2: Intelligently Select Active Chat (THE FIX) ===
  useEffect(() => {
    const incomingConvoId = location.state?.activeConvoId;
    if (incomingConvoId) {
      const chatToActivate = conversations.find((c) => c.id === incomingConvoId);
      if (chatToActivate) {
        setActiveChat(chatToActivate);
      }
      // Clear the state so it doesn't re-trigger on refresh
      window.history.replaceState({}, document.title);
    } else if (!activeChat && conversations.length > 0) {
      // If no chat is active (e.g., direct navigation) and we have conversations,
      // default to the first one in the list (the most recent).
      setActiveChat(conversations[0]);
    }
  }, [conversations, location.state, activeChat]); // This effect now depends on the loaded conversations

  // === Effect 3: Fetch Messages for Active Chat ===
  useEffect(() => {
    if (!activeChat) return;
    setLoadingMessages(true);

    const messagesRef = collection(db, "conversations", activeChat.id, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
      setLoadingMessages(false);
    });

    return () => unsubscribe();
  }, [activeChat]);

  // === Effect 4: Auto-scroll to bottom when messages update ===
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // === Send Message Handler ===
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !activeChat) return;
    const messageText = newMessage;
    setNewMessage("");
    try {
      const messagesRef = collection(db, "conversations", activeChat.id, "messages");
      await addDoc(messagesRef, {
        text: messageText,
        senderId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
      const convoRef = doc(db, "conversations", activeChat.id);
      await updateDoc(convoRef, {
        lastMessage: messageText,
        lastTimestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Message could not be sent.");
    }
  };

  return (
    <div className="messages-page-container">
      <Sidebar />
      <main className="messages-main-content main-content-area">
        <div className="conversations-panel">
          <div className="panel-header"><h2>Chats</h2></div>
          <div className="conversations-list">
            {loadingConvos ? (
              <div className="loading-state">Loading chats...</div>
            ) : conversations.length > 0 ? (
              conversations.map((convo) => (
                <div
                  key={convo.id}
                  className={`conversation-item ${activeChat?.id === convo.id ? "active" : ""}`}
                  onClick={() => setActiveChat(convo)}
                >
                  <img src={convo.otherUserAvatar} alt={convo.otherUserName} className="convo-avatar" />
                  <div className="convo-details">
                    <div className="convo-header">
                      <span className="convo-name">{convo.otherUserName}</span>
                      <span className="convo-timestamp">
                        {convo.lastTimestamp?.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="convo-last-message">{convo.lastMessage || "No messages yet"}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-convos">No conversations yet. Start one by messaging a mentor!</div>
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
                <Link to={`/book/${activeChat.skillId}`} className="schedule-btn">
                  <CalendarPlus size={20} /> Schedule Session
                </Link>
              </header>

              <div className="chat-window" ref={chatWindowRef}>
                {loadingMessages ? (
                  <div className="loading-state"><div className="spinner"></div></div>
                ) : messages.length > 0 ? (
                  messages.map((msg) => (
                    <div key={msg.id} className={`chat-bubble-wrapper ${msg.senderId === currentUser.uid ? "me" : "other"}`}>
                      <div className="chat-bubble">{msg.text}</div>
                    </div>
                  ))
                ) : (
                  <p className="no-messages">No messages yet. Send a message to get started!</p>
                )}
              </div>

              <form className="chat-input-form" onSubmit={handleSendMessage}>
                <input type="text" className="chat-input" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                <button type="submit" className="send-button" disabled={!newMessage.trim()}>
                  <Send size={20} />
                </button>
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
