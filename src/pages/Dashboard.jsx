// src/pages/Dashboard.jsx

import Sidebar from "../components/Sidebar";
import "../styles/DashboardPage.css"; // We'll create this new CSS file

// Mock data to make the dashboard feel alive
const dashboardData = {
  userName: "Harshal",
  stats: {
    upcomingSessions: 2,
    pendingRequests: 1,
    completedSessions: 4,
  },
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
    return new Date(dateString).toLocaleDateString("en-US", {
      month: 'long',
      day: 'numeric',
    });
};

export default function Dashboard() {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="dashboard-page-container">
      <Sidebar />
      <main className="dashboard-main-content">
        {/* === HEADER === */}
        <header className="dashboard-header">
          <div>
            <h1 className="header-title">Welcome back, {dashboardData.userName}! 👋</h1>
            <p className="header-subtitle">It's {today}. Let's make today productive.</p>
          </div>
          <button className="btn-primary">Request a Session</button>
        </header>

        {/* === STATS GRID === */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon upcoming">📅</div>
            <div className="stat-info">
              <span className="stat-value">{dashboardData.stats.upcomingSessions}</span>
              <span className="stat-label">Upcoming Sessions</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending">🔔</div>
            <div className="stat-info">
                <span className="stat-value">{dashboardData.stats.pendingRequests}</span>
                <span className="stat-label">Pending Requests</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completed">✅</div>
            <div className="stat-info">
                <span className="stat-value">{dashboardData.stats.completedSessions}</span>
                <span className="stat-label">Completed Sessions</span>
            </div>
          </div>
        </div>

        {/* === MAIN CONTENT GRID === */}
        <div className="dashboard-grid">
          {/* Action Cards */}
          <div className="action-card find-skill">
            <h3>Find a Skill</h3>
            <p>Explore hundreds of skills taught by community experts.</p>
            <button className="btn-secondary">Explore Now</button>
          </div>
          <div className="action-card offer-skill">
            <h3>Offer Your Skill</h3>
            <p>Share your knowledge and start teaching others today.</p>
            <button className="btn-secondary">Get Started</button>
          </div>
          
          {/* Upcoming Sessions Widget */}
          <div className="widget-card upcoming-sessions">
            <h3 className="widget-title">Upcoming Sessions</h3>
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

          {/* Recent Messages Widget */}
          <div className="widget-card recent-messages">
            <h3 className="widget-title">Recent Messages</h3>
            <div className="widget-list">
                {dashboardData.recentMessages.map(msg => (
                    <div key={msg.id} className="list-item message-item">
                        <img src={msg.avatar} alt={msg.name} className="item-avatar"/>
                        <div className="item-details">
                            <span className="item-title">{msg.name}</span>
                            <span className="item-subtitle">{msg.message}</span>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}