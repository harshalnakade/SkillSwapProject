import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Search, Zap, Award, Calendar, MessageSquare } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import "../styles/DashboardPage.css";

// Helper functions
const formatDate = (dateObject) => {
    if (!dateObject?.toDate) return "Date TBD";
    return dateObject.toDate().toLocaleDateString("en-US", { month: 'long', day: 'numeric' });
};
const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

export default function Dashboard() {
  const { currentUser } = useAuth();
  
  // State for live data, fetched by status
  const [stats, setStats] = useState({ upcoming: 0, pending: 0, completed: 0 });
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pendingSessions, setPendingSessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Effect to fetch all dashboard data in real-time
  useEffect(() => {
    if (!currentUser) return;
    
    let unsubscribes = [];
    
    // --- More efficient session fetching by status ---
    const statuses = ['Upcoming', 'Pending', 'Completed'];
    
    statuses.forEach(status => {
        let learnerData = [];
        let mentorData = [];
        
        const qLearner = query(
            collection(db, "sessions"),
            where("learnerId", "==", currentUser.uid),
            where("status", "==", status)
        );
        const qMentor = query(
            collection(db, "sessions"),
            where("mentorId", "==", currentUser.uid),
            where("status", "==", status)
        );

        const unsubLearner = onSnapshot(qLearner, (snapshot) => {
            learnerData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            updateSessionState(status, [...learnerData, ...mentorData]);
        });
        
        const unsubMentor = onSnapshot(qMentor, (snapshot) => {
            mentorData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            updateSessionState(status, [...learnerData, ...mentorData]);
        });
        
        unsubscribes.push(unsubLearner, unsubMentor);
    });

    const updateSessionState = (status, data) => {
        const sortedData = data.sort((a, b) => (a.sessionTime?.toDate() || 0) - (b.sessionTime?.toDate() || 0));
        if (status === 'Upcoming') setUpcomingSessions(sortedData);
        if (status === 'Pending') setPendingSessions(sortedData);
        if (status === 'Completed') setCompletedSessions(sortedData);
    };

    // --- Fetch Recent Conversations ---
    const convosQuery = query(
        collection(db, "conversations"),
        where("participants", "array-contains", currentUser.uid),
        orderBy("lastTimestamp", "desc")
    );
    const unsubConvos = onSnapshot(convosQuery, (snapshot) => {
        const convosData = snapshot.docs.map(doc => {
            const data = doc.data();
            const otherUserIndex = data.participants.findIndex(uid => uid !== currentUser.uid);
            return {
                id: doc.id, ...data,
                otherUserName: data.participantNames?.[otherUserIndex] || "User",
                otherUserAvatar: data.participantAvatars?.[otherUserIndex] || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.id}`,
            }
        });
        setRecentMessages(convosData);
    });
    unsubscribes.push(unsubConvos);

    setLoading(false);

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [currentUser]);

  // Effect to calculate stats when session data changes
  useEffect(() => {
    setStats({
        upcoming: upcomingSessions.length,
        pending: pendingSessions.length,
        completed: completedSessions.length
    });
  }, [upcomingSessions, pendingSessions, completedSessions]);


  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const greeting = getGreeting();
  
  if (loading || !currentUser) {
      return (
          <div className="dashboard-page-container">
              <Sidebar />
              <main className="dashboard-main-content">
                  <div className="loading-state">Loading Dashboard...</div>
              </main>
          </div>
      );
  }

  return (
    <div className="dashboard-page-container">
      <Sidebar />
      <main className="dashboard-main-content">
        <header className="dashboard-header">
          <div>
            <h1 className="header-title">{greeting}, {currentUser.name || currentUser.displayName || "User"}! 👋</h1>
            <p className="header-subtitle">It's {today}. Let's make today productive.</p>
          </div>
          <div className="header-actions">
            <div className="search-bar">
                <Search className="search-icon" size={20}/>
                <input type="text" placeholder="Search skills, mentors..." />
            </div>
           {currentUser.customData?.roles?.includes('learner') && (
    <Link to="/skills" className="btn-primary">Request a Session</Link>
)}
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon upcoming">📅</div>
            <div className="stat-info"><span className="stat-value">{stats.upcoming}</span><span className="stat-label">Upcoming Sessions</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending">🔔</div>
            <div className="stat-info"><span className="stat-value">{stats.pending}</span><span className="stat-label">Pending Requests</span></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completed">✅</div>
            <div className="stat-info"><span className="stat-value">{stats.completed}</span><span className="stat-label">Completed Sessions</span></div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="widget-card upcoming-sessions">
            <h3 className="widget-title"><Calendar size={20}/> Upcoming Sessions</h3>
            <div className="widget-list">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.slice(0, 4).map(session => (
                  <div key={session.id} className="list-item">
                    <div className="item-details">
                      <span className="item-title">{session.skillName}</span>
                      <span className="item-subtitle">with {currentUser.uid === session.mentorId ? session.learnerName : session.mentorName}</span>
                    </div>
                    <span className="item-meta">{formatDate(session.sessionTime)}</span>
                  </div>
                ))
              ) : (
                <p className="empty-state-text">No upcoming sessions. Time to learn something new!</p>
              )}
            </div>
          </div>

          <div className="widget-card gamification">
             <div className="streak-widget">
                  <Zap size={24} className="streak-icon"/>
                  <div className="streak-info">
                      <span className="stat-value">5 Days</span>
                      <span className="stat-label">Learning Streak</span>
                  </div>
             </div>
             <div className="achievements-widget">
                  <h4 className="widget-subtitle"><Award size={18}/> Achievements</h4>
                  <div className="achievements-list">
                      {['🥇', '🔥', '☕'].map((icon, i) => <div key={i} className="achievement-badge">{icon}</div>)}
                  </div>
             </div>
            </div>
          
           <div className="widget-card recent-messages">
             <h3 className="widget-title"><MessageSquare size={20}/> Recent Messages</h3>
             <div className="widget-list">
                 {recentMessages.length > 0 ? (
                     recentMessages.slice(0, 4).map(msg => (
                         <Link to="/messages" state={{ activeConvoId: msg.id }} key={msg.id} className="list-item message-item">
                             <img src={msg.otherUserAvatar} alt={msg.otherUserName} className="item-avatar"/>
                             <div className="item-details">
                                 <span className="item-title">{msg.otherUserName}</span>
                                 <span className="item-subtitle">{msg.lastMessage}</span>
                             </div>
                         </Link>
                     ))
                 ) : (
                     <p className="empty-state-text">No recent messages.</p>
                 )}
             </div>
           </div>
          
          <div className="widget-card action-card-container">
            {currentUser.customData?.roles?.includes('learner') && (
    <Link to="/skills" className="action-card find-skill">
        <h3>Find a Mentor</h3>
        <p>Explore skills taught by experts.</p>
        <button className="btn-secondary">Explore Now</button>
    </Link>
)}
{currentUser.customData?.roles?.includes('teacher') && (
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

