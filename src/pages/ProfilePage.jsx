import { useState } from "react";
import { EditProfileModal } from "../components/models/EditProfileModel";
import "../styles/ProfilePage.css";

// Mock user data
const mockUser = {
  name: "Harshal Nakade",
  bio: "Full Stack Developer | Loves to build and share skills 🚀",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harshal",
  skills: [
    { id: 1, name: "React", level: "Advanced" },
    { id: 2, name: "Node.js", level: "Intermediate" },
    { id: 3, name: "Flutter", level: "Intermediate" },
  ],
  sessions: [
    { id: 1, title: "React Basics Workshop", date: "12 Aug 2025" },
    { id: 2, title: "Intro to Flutter", date: "05 Aug 2025" },
  ],
};

export default function ProfilePage() {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="profile-page">
      {/* User Info Card */}
      <div className="card user-info">
        <img className="avatar" src={mockUser.avatar} alt={mockUser.name} />
        <div className="user-details">
          <h2>{mockUser.name}</h2>
          <p>{mockUser.bio}</p>
        </div>
        <button className="btn-edit" onClick={() => setEditOpen(true)}>
          Edit Profile
        </button>
      </div>

      {/* Skills Card */}
      <div className="card skills-card">
        <h3>My Skills</h3>
        <div className="skills">
          {mockUser.skills.map((skill) => (
            <span key={skill.id} className="badge">
              {skill.name} • {skill.level}
            </span>
          ))}
        </div>
      </div>

      {/* Sessions Card */}
      <div className="card sessions-card">
        <h3>My Sessions</h3>
        <ul className="sessions">
          {mockUser.sessions.map((session) => (
            <li key={session.id} className="session-item">
              <span>{session.title}</span>
              <span className="date">{session.date}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
}
