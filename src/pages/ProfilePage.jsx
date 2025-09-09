import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import EditProfileModal from "../components/EditProfileModal";
import { MapPin, Calendar, Star, Edit, Trash2 } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc, getDocs } from "firebase/firestore";
import "../styles/ProfilePage.css";

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  
  // State for all live data sections
  const [mySkills, setMySkills] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ taught: 0, attended: 0, rating: "New" });

  // Single loading state for the page
  const [loading, setLoading] = useState(true);

  // Effect to fetch all necessary data for the profile
  useEffect(() => {
    if (!currentUser) return;
    
    setLoading(true);

    // Fetch user's offered skills
    const skillsQuery = query(collection(db, "skills"), where("teacherId", "==", currentUser.uid));
    const unsubscribeSkills = onSnapshot(skillsQuery, (snapshot) => {
      setMySkills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // NEW & IMPROVED: Fetch sessions with two separate queries and merge them
    const fetchSessions = async () => {
        const mentorQuery = query(collection(db, "sessions"), where("mentorId", "==", currentUser.uid));
        const learnerQuery = query(collection(db, "sessions"), where("learnerId", "==", currentUser.uid));

        const mentorSnap = await getDocs(mentorQuery);
        const learnerSnap = await getDocs(learnerQuery);

        const mentorSessions = mentorSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), userRole: 'Mentor' }));
        const learnerSessions = learnerSnap.docs.map(doc => ({ id: doc.id, ...doc.data(), userRole: 'Learner' }));

        // Combine and remove duplicates (in case a user somehow mentored themselves)
        const allSessions = [...mentorSessions, ...learnerSessions];
        const uniqueSessions = Array.from(new Map(allSessions.map(item => [item.id, item])).values());
        
        setSessionHistory(uniqueSessions);
    };

    fetchSessions(); // Call the async function
    
    // Fetch reviews for the current user (where they were the mentor)
    const reviewsQuery = query(collection(db, "reviews"), where("mentorId", "==", currentUser.uid));
    const unsubscribeReviews = onSnapshot(reviewsQuery, (snapshot) => {
        setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    setLoading(false); // All listeners are set up

    return () => {
      unsubscribeSkills();
      unsubscribeReviews();
    };
  }, [currentUser]);
  
  // Effect to calculate stats whenever session or review data changes
  useEffect(() => {
      const taughtCount = sessionHistory.filter(s => s.userRole === 'Mentor' && s.status === 'Completed').length;
      const attendedCount = sessionHistory.filter(s => s.userRole === 'Learner' && s.status === 'Completed').length;
      
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : "New";

      setStats({ taught: taughtCount, attended: attendedCount, rating: avgRating });
  }, [sessionHistory, reviews]);


  const handleDeleteSkill = async (skillId) => {
    if (window.confirm("Are you sure you want to delete this skill? This action cannot be undone.")) {
        try {
            await deleteDoc(doc(db, "skills", skillId));
            alert("Skill deleted successfully.");
        } catch (error) {
            console.error("Error deleting skill:", error);
            alert("Failed to delete skill.");
        }
    }
  };

  // UPDATED: Access 'memberSince' from customData
  const memberSinceDate = currentUser?.customData?.memberSince?.toDate
      ? currentUser.customData.memberSince.toDate().toLocaleDateString("en-US", { month: 'long', year: 'numeric' })
      : "Not available";

  if (loading || !currentUser) {
    return (
        <div className="profile-page-container">
            <Sidebar />
            <main className="profile-main-content main-content-area">
                <div className="loading-state">Loading Profile...</div>
            </main>
        </div>
    );
  }

  return (
    <div className="profile-page-container">
      <Sidebar />
      <main className="profile-main-content main-content-area">
        <header className="profile-header">
          <div className="profile-banner"></div>
          <div className="profile-details-wrapper">
            <div className="profile-avatar-container">
                {/* UPDATED: Access 'avatar' and 'name' from customData, with fallbacks to auth object */}
              <img className="profile-avatar" src={currentUser.customData?.avatar || currentUser.photoURL || 'https://via.placeholder.com/150'} alt={currentUser.customData?.name || currentUser.displayName} />
            </div>
            <div className="profile-info">
              <h1 className="user-name">{currentUser.customData?.name || currentUser.displayName}</h1>
              <div className="user-meta">
                {/* UPDATED: Access 'location' from customData */}
                {currentUser.customData?.location && <span><MapPin size={16} /> {currentUser.customData.location}</span>}
                <span><Calendar size={16} /> Member since {memberSinceDate}</span>
              </div>
            </div>
            <button className="btn-edit-profile" onClick={() => setEditOpen(true)}>Edit Profile</button>
          </div>
        </header>

        <section className="stats-bar">
          <div className="stat-item"><span className="stat-value">{stats.taught}</span><span className="stat-label">Sessions Taught</span></div>
          <div className="stat-item"><span className="stat-value">{stats.attended}</span><span className="stat-label">Sessions Attended</span></div>
          <div className="stat-item"><span className="stat-value"><Star size={20} className="star-icon" /> {stats.rating}</span><span className="stat-label">Average Rating</span></div>
        </section>

        <div className="profile-content-grid">
          <div className="profile-left-column">
            <div className="profile-card">
              <h2 className="card-title">About Me</h2>
              {/* UPDATED: Access 'bio' from customData */}
              <p className="user-bio">{currentUser.customData?.bio || "No bio added yet. Click 'Edit Profile' to tell the community about yourself."}</p>
            </div>
            
            <div className="profile-card">
              <h2 className="card-title">My Offered Skills</h2>
              {mySkills.length > 0 ? (
                <div className="my-skills-list">
                  {mySkills.map((skill) => (
                    <div key={skill.id} className="my-skill-item">
                      <div className="skill-badge">
                        <span className="skill-name">{skill.skillName}</span>
                        <span className={`skill-level ${skill.level.toLowerCase()}`}>{skill.level}</span>
                      </div>
                      <div className="skill-actions">
                        <button onClick={() => navigate(`/offer-skill/edit/${skill.id}`)} className="btn-icon"><Edit size={18} /> <span>Edit</span></button>
                        <button onClick={() => handleDeleteSkill(skill.id)} className="btn-icon btn-delete"><Trash2 size={18} /> <span>Delete</span></button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state-text">You haven't offered any skills yet. Click "Offer a New Skill" in the sidebar to get started!</p>
              )}
            </div>
          </div>

          <div className="profile-right-column">
             <div className="profile-card">
                <h2 className="card-title">Session History</h2>
                {sessionHistory.length > 0 ? (
                    <ul className="sessions-list">
                        {sessionHistory.slice(0, 5).map((session) => ( // Show latest 5
                        <li key={session.id} className="session-item">
                            <div className={`status-dot ${session.status.toLowerCase()}`}></div>
                            <div className="session-info">
                                <span className="session-title">{session.skillName}</span>
                                <span className="session-date">
                                    {session.sessionTime?.toDate().toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        </li>
                        ))}
                    </ul>
                ) : <p className="empty-state-text">Your session history will appear here.</p>}
            </div>
            <div className="profile-card">
                <h2 className="card-title">Reviews</h2>
                {reviews.length > 0 ? (
                    <div className="reviews-container">
                        {reviews.slice(0, 3).map(review => ( // Show latest 3
                            <div key={review.id} className="review-item">
                                <img src={review.learnerAvatar || 'https://via.placeholder.com/150'} alt={review.learnerName} className="reviewer-avatar" />
                                <div className="review-content">
                                    <p className="review-quote">"{review.comment}"</p>
                                    <div className="reviewer-info">
                                        <span>- {review.learnerName}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : <p className="empty-state-text">Reviews from your sessions will appear here.</p>}
            </div>
          </div>
        </div>
      </main>
      <EditProfileModal isOpen={editOpen} onClose={() => setEditOpen(false)} />
    </div>
  );
}

