
// src/pages/Dashboard.jsx

import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Search, Zap, Award, Calendar, MessageSquare } from 'lucide-react';
import "../styles/DashboardPage.css";

// Updated mock data - removed 'continueLearning'
const dashboardData = {
  userName: "Harshal",
  roles: ['learner', 'teacher'],
  stats: {
    upcomingSessions: 2,
    pendingRequests: 1,
    completedSessions: 4,
  },
  learningStreak: 5,
  achievements: [
    { id: 1, name: "First Session Completed", icon: "🥇" },
    { id: 2, name: "5 Day Streak", icon: "🔥" },
    { id: 3, name: "Java Expert", icon: "☕" },
  ],
  upcomingSessions: [
    { id: 1, skill: "Advanced React Patterns", teacher: "Harshal Nakade", date: "2025-09-05T14:00:00Z" },
    { id: 2, skill: "Acoustic Guitar", teacher: "Santoshi Patil", date: "2025-09-02T18:30:00Z" },
  ],
  recentMessages: [
    { id: 1, name: "Santoshi Patil", message: "Sounds great! See you then.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Santoshi" },
    { id: 2, name: "Rahul Singh", message: "I've pushed the latest code.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" },
  ],
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: 'long', day: 'numeric' });
};

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

export default function Dashboard() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const greeting = getGreeting();

  return (
    <div className="dashboard-page-container">
      <Sidebar />
      <main className="dashboard-main-content">
        <header className="dashboard-header">
          <div>
            <h1 className="header-title">{greeting}, {dashboardData.userName}! 👋</h1>
            <p className="header-subtitle">It's {today}. Let's make today productive.</p>
          </div>
          <div className="header-actions">
            <div className="search-bar">
                <Search className="search-icon" size={20}/>
                <input type="text" placeholder="Search skills, mentors..." />
            </div>
            {/* UPDATED: Button is now a functional Link */}
            {dashboardData.roles.includes('learner') && (
                 <Link to="/skills" className="btn-primary">Request a Session</Link>
            )}
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon upcoming">📅</div>
            <div className="stat-info"><span className="stat-value">{dashboardData.stats.upcomingSessions}</span><span className="stat-label">Upcoming Sessions</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending">🔔</div>
            <div className="stat-info"><span className="stat-value">{dashboardData.stats.pendingRequests}</span><span className="stat-label">Pending Requests</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completed">✅</div>
            <div className="stat-info"><span className="stat-value">{dashboardData.stats.completedSessions}</span><span className="stat-label">Completed Sessions</span></div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Upcoming Sessions Widget */}
          <div className="widget-card upcoming-sessions">
            <h3 className="widget-title"><Calendar size={20}/> Upcoming Sessions</h3>
            <div className="widget-list">
              {dashboardData.upcomingSessions.map(session => (
                <div key={session.id} className="list-item">
                  <div className="item-details">
                    <span className="item-title">{session.skill}</span>
                    <span className="item-subtitle">with {session.teacher}</span>
                  </div>
                  <span className="item-meta">{formatDate(session.date)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gamification Widget */}
          <div className="widget-card gamification">
            <div className="streak-widget">
                <Zap size={24} className="streak-icon"/>
                <div className="streak-info">
                    <span className="stat-value">{dashboardData.learningStreak} Days</span>
                    <span className="stat-label">Learning Streak</span>
                </div>
            </div>
            <div className="achievements-widget">
                <h4 className="widget-subtitle"><Award size={18}/> Achievements</h4>
                <div className="achievements-list">
                    {dashboardData.achievements.map(ach => (
                        <div key={ach.id} className="achievement-badge" title={ach.name}>
                            {ach.icon}
                        </div>
                    ))}
                </div>
            </div>
          </div>
          
          {/* NEW: Recent Messages Widget */}
          <div className="widget-card recent-messages">
            <h3 className="widget-title"><MessageSquare size={20}/> Recent Messages</h3>
            <div className="widget-list">
                {dashboardData.recentMessages.map(msg => (
                    <Link to="/messages" key={msg.id} className="list-item message-item">
                        <img src={msg.avatar} alt={msg.name} className="item-avatar"/>
                        <div className="item-details">
                            <span className="item-title">{msg.name}</span>
                            <span className="item-subtitle">{msg.message}</span>
                        </div>
                    </Link>
                ))}
            </div>
          </div>
          
          {/* Role-Based Action Cards */}
          <div className="widget-card action-card-container">
            {dashboardData.roles.includes('learner') && (
                <Link to="/skills" className="action-card find-skill">
                    <h3>Find a Mentor</h3>
                    <p>Explore skills taught by experts.</p>
                    <button className="btn-secondary">Explore Now</button>
                </Link>
            )}
            {dashboardData.roles.includes('teacher') && (
                <Link to="/offer-skill" className="action-card offer-skill">
                    <h3>Offer Your Skill</h3>
                    <p>Share your knowledge with others.</p>
                    <button className="btn-secondary">Get Started</button>
                </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}