import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import EditProfileModal from "../components/EditProfileModal";
import { MapPin, Calendar, Star, Edit, Trash2 } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import "../styles/ProfilePage.css";

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);
  const [mySkills, setMySkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setLoadingSkills(true);
      const skillsQuery = query(collection(db, "skills"), where("teacherId", "==", currentUser.uid));
      const unsubscribe = onSnapshot(skillsQuery, (querySnapshot) => {
        const skillsData = [];
        querySnapshot.forEach((doc) => {
          skillsData.push({ id: doc.id, ...doc.data() });
        });
        setMySkills(skillsData);
        setLoadingSkills(false);
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleDeleteSkill = async (skillId) => {
    if (window.confirm("Are you sure you want to delete this skill? This action cannot be undone.")) {
        try {
            await deleteDoc(doc(db, "skills", skillId));
            alert("Skill deleted successfully.");
        } catch (error) {
            console.error("Error deleting skill:", error);
            alert("Failed to delete skill. Please try again.");
        }
    }
  };

  const memberSinceDate = currentUser?.memberSince?.toDate 
      ? currentUser.memberSince.toDate().toLocaleDateString("en-US", { month: 'long', year: 'numeric' })
      : "Not available";

  if (!currentUser) {
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
                <img className="profile-avatar" src={currentUser.avatar || currentUser.photoURL} alt={currentUser.name || currentUser.displayName} />
            </div>
            <div className="profile-info">
              <h1 className="user-name">{currentUser.name || currentUser.displayName}</h1>
              <div className="user-meta">
                {currentUser.location && <span><MapPin size={16} /> {currentUser.location}</span>}
                <span><Calendar size={16} /> Member since {memberSinceDate}</span>
              </div>
            </div>
            <button className="btn-edit-profile" onClick={() => setEditOpen(true)}>
              Edit Profile
            </button>
          </div>
        </header>

        {/* Stats Bar (Still uses placeholder data for now) */}
        <section className="stats-bar">
          <div className="stat-item"><span className="stat-value">12</span><span className="stat-label">Sessions Taught</span></div>
          <div className="stat-item"><span className="stat-value">28</span><span className="stat-label">Sessions Attended</span></div>
          <div className="stat-item"><span className="stat-value"><Star size={20} className="star-icon" /> 4.9</span><span className="stat-label">Average Rating</span></div>
        </section>

        <div className="profile-content-grid">
          <div className="profile-left-column">
            <div className="profile-card">
              <h2 className="card-title">About Me</h2>
              <p className="user-bio">{currentUser.bio || "No bio added yet. Click 'Edit Profile' to tell the community about yourself."}</p>
            </div>
            
            <div className="profile-card">
              <h2 className="card-title">My Offered Skills</h2>
              {loadingSkills ? ( <p>Loading skills...</p> ) 
              : mySkills.length > 0 ? (
                <div className="my-skills-list">
                  {mySkills.map((skill) => (
                    <div key={skill.id} className="my-skill-item">
                      <div className="skill-badge">
                        <span className="skill-name">{skill.skillName}</span>
                        <span className={`skill-level ${skill.level.toLowerCase()}`}>{skill.level}</span>
                      </div>
                      <div className="skill-actions">
                        <button onClick={() => navigate(`/offer-skill/edit/${skill.id}`)} className="btn-icon">
                            <Edit size={18} /> <span>Edit</span>
                        </button>
                        <button onClick={() => handleDeleteSkill(skill.id)} className="btn-icon btn-delete">
                            <Trash2 size={18} /> <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>You haven't offered any skills yet. Click "Offer a New Skill" in the sidebar to get started!</p>
              )}
            </div>
          </div>
          <div className="profile-right-column">
             <div className="profile-card">
                <h2 className="card-title">Session History</h2>
                <p>Your session history will appear here.</p>
            </div>
            <div className="profile-card">
                <h2 className="card-title">Reviews</h2>
                <p>Reviews from your sessions will appear here.</p>
            </div>
          </div>
        </div>
      </main>
      <EditProfileModal isOpen={editOpen} onClose={() => setEditOpen(false)} />
    </div>
  );
}

