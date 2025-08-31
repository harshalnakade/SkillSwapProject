// src/pages/ProfilePage.jsx

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { EditProfileModal } from "../components/models/EditProfileModel";
import { MapPin, Calendar, Star, MessageSquareQuote } from 'lucide-react';
import "../styles/ProfilePage.css";

// Expanded mock data for a richer profile
const mockUser = {
  name: "Harshal Nakade",
  bio: "Full Stack Developer with a passion for creating beautiful, functional web applications. I believe in the power of shared knowledge and continuous learning.",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harshal",
  location: "Pune, India",
  memberSince: "August 2024",
  stats: {
    taught: 12,
    attended: 28,
    rating: 4.9,
  },
  skills: [
    { id: 1, name: "React", level: "Advanced" },
    { id: 2, name: "Node.js", level: "Intermediate" },
    { id: 3, name: "TypeScript", level: "Advanced" },
    { id: 4, name: "GraphQL", level: "Beginner" },
    { id: 5, name: "Figma", level: "Intermediate" },
  ],
  sessionHistory: [
    { id: 1, title: "React Basics Workshop", date: "2025-08-12", status: "Completed" },
    { id: 2, title: "Intro to Flutter", date: "2025-08-05", status: "Completed" },
    { id: 3, title: "Advanced React Patterns", date: "2025-09-05", status: "Upcoming" },
  ],
  reviews: [
      { id: 1, reviewer: "Santoshi Patil", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Santoshi", quote: "Harshal is an amazing teacher! He explains complex topics in a simple, understandable way. Highly recommended!" },
      { id: 2, reviewer: "Rahul Singh", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul", quote: "Learned so much about React Hooks in just one session. The session was well-structured and very practical." },
  ]
};

export default function ProfilePage() {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="profile-page-container">
      <Sidebar />
      <main className="profile-main-content">
        {/* === Profile Header === */}
        <header className="profile-header">
          <div className="profile-banner"></div>
          <div className="profile-details-wrapper">
            <div className="profile-avatar-container">
                <img className="profile-avatar" src={mockUser.avatar} alt={mockUser.name} />
            </div>
            <div className="profile-info">
              <h1 className="user-name">{mockUser.name}</h1>
              <div className="user-meta">
                <span><MapPin size={16} /> {mockUser.location}</span>
                <span><Calendar size={16} /> Member since {mockUser.memberSince}</span>
              </div>
            </div>
            <button className="btn-edit-profile" onClick={() => setEditOpen(true)}>
              Edit Profile
            </button>
          </div>
        </header>

        {/* === Stats Bar === */}
        <section className="stats-bar">
          <div className="stat-item">
            <span className="stat-value">{mockUser.stats.taught}</span>
            <span className="stat-label">Sessions Taught</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{mockUser.stats.attended}</span>
            <span className="stat-label">Sessions Attended</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">
              <Star size={20} className="star-icon" /> {mockUser.stats.rating}
            </span>
            <span className="stat-label">Average Rating</span>
          </div>
        </section>

        {/* === Main Content Grid (2 Columns) === */}
        <div className="profile-content-grid">
          {/* Left Column */}
          <div className="profile-left-column">
            <div className="profile-card">
              <h2 className="card-title">About Me</h2>
              <p className="user-bio">{mockUser.bio}</p>
            </div>
            <div className="profile-card">
              <h2 className="card-title">My Skills</h2>
              <div className="skills-container">
                {mockUser.skills.map((skill) => (
                  <div key={skill.id} className="skill-badge">
                    <span className="skill-name">{skill.name}</span>
                    <span className={`skill-level ${skill.level.toLowerCase()}`}>{skill.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="profile-right-column">
             <div className="profile-card">
                <h2 className="card-title">Session History</h2>
                <ul className="sessions-list">
                    {mockUser.sessionHistory.map((session) => (
                    <li key={session.id} className="session-item">
                        <div className={`status-dot ${session.status.toLowerCase()}`}></div>
                        <div className="session-info">
                            <span className="session-title">{session.title}</span>
                            <span className="session-date">{new Date(session.date).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
            <div className="profile-card">
                <h2 className="card-title">Reviews</h2>
                <div className="reviews-container">
                    {mockUser.reviews.map(review => (
                        <div key={review.id} className="review-item">
                            <MessageSquareQuote className="quote-icon"/>
                            <p className="review-quote">"{review.quote}"</p>
                            <div className="reviewer-info">
                                <img src={review.avatar} alt={review.reviewer} className="reviewer-avatar"/>
                                <span>- {review.reviewer}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </main>

      {/* <EditProfileModal open={editOpen} onOpenChange={setEditOpen} /> */}
    </div>
  );
}