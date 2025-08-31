import Sidebar from "../components/Sidebar";
import ChatBubble from "../components/ChatBubble";
import "../styles/MessagesPage.css";

export default function Messages() {
  const chats = [
    { message: "Hello!", sender: "me" },
    { message: "Hi Harshal!", sender: "other" },
  ];

  return (
    <div className="landing-page">
      <Sidebar />

      <div className="messages-content">
        <h1>Messages</h1>
        <div className="chat-container">
          {chats.map((c, idx) => (
            <ChatBubble key={idx} {...c} />
          ))}
        </div>
      </div>
    </div>
  );
}
