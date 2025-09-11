import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Calendar, MessageSquare, PlusCircle, LogOut, Search } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import './Sidebar.css';

export default function Sidebar() {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Get the live user data

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to landing page after logout
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <nav className="sidebar-container">
      {/* === HEADER === */}
      <div className="sidebar-header">
        <Link to="/dashboard" className="sidebar-logo">
          SkillSwap
        </Link>
      </div>

      {/* === MAIN NAVIGATION === */}
      <div className="sidebar-main">
        <ul className="sidebar-menu">
          <li><p className="menu-title">MENU</p></li>
          <li>
            <NavLink to="/dashboard" className="menu-item">
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/skills" className="menu-item">
              <BookOpen size={20} />
              <span>Explore Skills</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/sessions" className="menu-item">
              <Calendar size={20} />
              <span>My Sessions</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/messages" className="menu-item">
              <MessageSquare size={20} />
              <span>Messages</span>
            </NavLink>
          </li>
        </ul>

        {/* === QUICK ACTIONS === */}
        <div className="quick-actions">
          <p className="menu-title">QUICK ACTIONS</p>

          {/* Teacher: Offer a Skill */}
          {currentUser?.customData?.roles?.includes("teacher") && (
            <Link to="/offer-skill" className="action-btn">
              <PlusCircle size={20} />
              <span>Offer a New Skill</span>
            </Link>
          )}

          {/* Learner: Find Mentor */}
          {currentUser?.customData?.roles?.includes("learner") && (
            <Link to="/skills" className="action-btn secondary">
              <Search size={20} />
              <span>Find a Mentor</span>
            </Link>
          )}
        </div>
      </div>

      {/* === FOOTER WITH PROFILE & LOGOUT === */}
      <div className="sidebar-footer">
        {currentUser ? (
          <>
            <NavLink to="/profile" className="user-profile-link">
              <img
                src={
                  currentUser.customData?.avatar ||
                  currentUser.photoURL ||
                  "https://via.placeholder.com/150"
                }
                alt={currentUser.customData?.name || currentUser.displayName}
                className="user-avatar"
              />
              <div className="user-info">
                <span className="user-name">
                  {currentUser.customData?.name || currentUser.displayName}
                </span>
                <span className="user-role">View Profile</span>
              </div>
            </NavLink>

            <button onClick={handleLogout} className="logout-btn" title="Log Out">
              <LogOut size={20} />
            </button>
          </>
        ) : (
          // Skeleton loader while fetching user data
          <div className="user-profile-link skeleton">
            <div className="user-avatar skeleton-avatar"></div>
            <div className="user-info">
              <span className="skeleton-text"></span>
              <span className="skeleton-text short"></span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
