import Sidebar from "../components/Sidebar";
import "../styles/SessionsPage.css";

export default function Sessions() {
  const sessions = [
    { skill: "Web Dev", date: "2025-09-01", status: "Pending" },
    { skill: "Guitar", date: "2025-08-28", status: "Completed" },
  ];

  return (
    <div className="landing-page">
      <Sidebar />
      <div className="sessions-content">
        <h1>My Sessions</h1>
        <div className="features-cards">
          {sessions.map((s, idx) => (
            <div key={idx} className="feature-card session-card">
              <h3>{s.skill}</h3>
              <p>Date: {s.date}</p>
              <p>Status: {s.status}</p>
            </div>
          ))}
        </div>
        <button className="btn-primary request-btn">Request New Session</button>
      </div>
    </div>
  );
}
