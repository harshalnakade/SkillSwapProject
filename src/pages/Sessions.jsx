// src/pages/Sessions.jsx

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/SessionsPage.css"; // We will create this new CSS file

// More realistic mock data
const mockSessions = [
  {
    id: 1,
    skill: "Advanced React Patterns",
    teacher: "Harshal Nakade",
    date: "2025-09-05T14:00:00Z", // Using ISO format is better
    status: "Upcoming",
    format: "Online",
  },
  {
    id: 2,
    skill: "Acoustic Guitar Fundamentals",
    teacher: "Santoshi Patil",
    date: "2025-09-02T18:30:00Z",
    status: "Upcoming",
    format: "In-Person",
  },
  {
    id: 3,
    skill: "Data Science with Python",
    teacher: "Rahul Singh",
    date: "2025-08-28T11:00:00Z",
    status: "Completed",
    format: "Online",
  },
  {
    id: 4,
    skill: "Introduction to Figma",
    teacher: "Maria Garcia",
    date: "2025-08-25T16:00:00Z",
    status: "Completed",
    format: "Online",
  },
  {
    id: 5,
    skill: "Conversational Spanish",
    teacher: "Maria Garcia",
    date: "2025-09-10T19:00:00Z",
    status: "Pending",
    format: "Online",
  },
];

const SessionStatus = ({ status }) => {
  return <span className={`status-badge ${status.toLowerCase()}`}>{status}</span>;
};

export default function Sessions() {
  const [activeTab, setActiveTab] = useState("Upcoming");

  const filteredSessions = mockSessions.filter(
    (session) => session.status === activeTab
  );
  
  // A helper function to format dates nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="sessions-page-container">
      <Sidebar />
      <main className="sessions-main-content">
        <header className="sessions-header">
          <h1 className="sessions-title">My Sessions</h1>
          <button className="btn-new-session">Request New Session</button>
        </header>

        <div className="sessions-container">
          <div className="sessions-tabs">
            <button
              className={`tab ${activeTab === "Upcoming" ? "active" : ""}`}
              onClick={() => setActiveTab("Upcoming")}
            >
              Upcoming
            </button>
            <button
              className={`tab ${activeTab === "Pending" ? "active" : ""}`}
              onClick={() => setActiveTab("Pending")}
            >
              Pending
            </button>
            <button
              className={`tab ${activeTab === "Completed" ? "active" : ""}`}
              onClick={() => setActiveTab("Completed")}
            >
              Completed
            </button>
          </div>

          <div className="sessions-list">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <div key={session.id} className="session-item">
                  <div className="session-details">
                    <h3 className="session-skill">{session.skill}</h3>
                    <p className="session-teacher">with {session.teacher}</p>
                  </div>
                  <div className="session-meta">
                     <span className="session-date">{formatDate(session.date)}</span>
                     <span className="session-format">{session.format}</span>
                  </div>
                  <div className="session-status">
                    <SessionStatus status={session.status} />
                  </div>
                  <div className="session-actions">
                     <button className="btn-details">Details</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-sessions">
                <p>You have no {activeTab.toLowerCase()} sessions.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}