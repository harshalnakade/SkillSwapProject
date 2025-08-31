export default function ChatBubble({ message, sender }) {
  return (
    <div style={{
      backgroundColor: sender === "me" ? "#d1e7dd" : "#f8d7da",
      padding: "8px",
      margin: "4px 0",
      borderRadius: "8px",
      maxWidth:"70%"
    }}>
      {message}
    </div>
  );
}
