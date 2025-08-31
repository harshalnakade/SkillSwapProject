import Sidebar from "../components/Sidebar";
import ChatBubble from "../components/ChatBubble";

export default function Messages() {
  const chats = [
    { message: "Hello!", sender: "me" },
    { message: "Hi Harshal!", sender: "other" }
  ];

  return (
    <div>
      <Sidebar />
      <div style={{marginLeft:"210px", padding:"16px"}}>
        <h2>Messages</h2>
        <div>
          {chats.map((c, idx) => <ChatBubble key={idx} {...c} />)}
        </div>
      </div>
    </div>
  );
}
