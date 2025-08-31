// src/pages/Sessions.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { X, Star } from "lucide-react";
import "../styles/SessionsPage.css";

// Mock data now includes the user's role in the session
const mockSessions = [
  {
    id: 1,
    skill: "Advanced React Patterns",
    participant: "Shrushti P.", // The other person
    role: "Mentor", // The current user's role
    date: "2025-09-05T14:00:00Z",
    status: "Upcoming",
    format: "Online",
    meetingLink: "https://zoom.us/j/1234567890", // Example link
  },
  {
    id: 2,
    skill: "Data Science with Python",
    participant: "Rahul Singh",
    role: "Learner",
    date: "2025-08-28T11:00:00Z",
    status: "Completed",
    format: "Online",
  },
  {
    id: 5,
    skill: "Java & Spring Boot",
    participant: "Prajwal G.",
    role: "Mentor",
    date: "2025-09-10T19:00:00Z",
    status: "Pending",
    format: "Online",
  },
];

// NEW: A simple modal for leaving a review
const ReviewModal = ({ session, onClose }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            sessionId: session.id,
            rating,
            comment,
        });
        alert("Thank you for your review!");
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}><X size={24} /></button>
                <h3>Leave a Review for</h3>
                <h2>{session.skill}</h2>
                <p>with {session.participant}</p>

                <form onSubmit={handleSubmit} className="review-form">
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                                key={star}
                                className={star <= rating ? 'filled' : ''}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>
                    <textarea 
                        rows="4" 
                        placeholder="Share your experience..." 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-primary">Submit Review</button>
                </form>
            </div>
        </div>
    );
};


export default function Sessions() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [reviewingSession, setReviewingSession] = useState(null);

  const filteredSessions = mockSessions.filter(
    (session) => session.status === activeTab
  );
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div className="sessions-page-container">
      <Sidebar />
      <main className="sessions-main-content">
        <header className="sessions-header">
          <h1 className="sessions-title">My Sessions</h1>
          <Link to="/skills" className="btn-new-session">Request New Session</Link>
        </header>

        <div className="sessions-container">
          <div className="sessions-tabs">
            <button className={`tab ${activeTab === "Upcoming" ? "active" : ""}`} onClick={() => setActiveTab("Upcoming")}>Upcoming</button>
            <button className={`tab ${activeTab === "Pending" ? "active" : ""}`} onClick={() => setActiveTab("Pending")}>Pending</button>
            <button className={`tab ${activeTab === "Completed" ? "active" : ""}`} onClick={() => setActiveTab("Completed")}>Completed</button>
          </div>

          <div className="sessions-list">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <div key={session.id} className="session-item">
                  <div className="session-details">
                    <h3 className="session-skill">{session.skill}</h3>
                    <p className="session-participant">
                      {session.role === 'Mentor' ? 'Mentoring' : 'Learning from'} <strong>{session.participant}</strong>
                    </p>
                  </div>
                  <div className="session-meta">
                     <span className="session-date">{formatDate(session.date)}</span>
                     <span className="session-format">{session.format}</span>
                  </div>
                  <div className="session-status">
                    <span className={`status-badge ${session.status.toLowerCase()}`}>{session.status}</span>
                  </div>
                  <div className="session-actions">
                     {session.status === 'Upcoming' && <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="btn-primary">Join Session</a>}
                     {session.status === 'Pending' && session.role === 'Mentor' && (
                        <>
                            <button className="btn-secondary">Decline</button>
                            <button className="btn-primary">Accept</button>
                        </>
                     )}
                     {session.status === 'Completed' && <button className="btn-primary" onClick={() => setReviewingSession(session)}>Leave a Review</button>}
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

      {reviewingSession && (
        <ReviewModal session={reviewingSession} onClose={() => setReviewingSession(null)} />
      )}
    </div>
  );
}