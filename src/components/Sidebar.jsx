// src/components/Sidebar.jsx

import { Link, NavLink } from "react-router-dom";
import { LayoutDashboard, User, BookOpen, Calendar, MessageSquare, PlusCircle, LogOut } from 'lucide-react';
import './Sidebar.css'; // We'll use the new CSS below

// Mock user data (in a real app, this would come from context or props)
const mockUser = {
  name: "Harshal Nakade",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harshal",
};

export default function Sidebar() {
  return (
    <nav className="sidebar-container">
      <div className="sidebar-header">
        <Link to="/dashboard" className="sidebar-logo">
          SkillSwap
        </Link>
      </div>

      <div className="sidebar-main">
        {/* === Main Navigation === */}
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

        {/* === Quick Actions === */}
        <div className="quick-actions">
           <p className="menu-title">QUICK ACTIONS</p>
           <button className="action-btn">
             <PlusCircle size={20} />
             <span>Offer a New Skill</span>
           </button>
           <button className="action-btn secondary">
             <span>Request a Session</span>
           </button>
        </div>
      </div>


      {/* === Sidebar Footer with User Profile === */}
      <div className="sidebar-footer">
        <Link to="/profile" className="user-profile-link">
          <img src={mockUser.avatar} alt={mockUser.name} className="user-avatar" />
          <div className="user-info">
            <span className="user-name">{mockUser.name}</span>
            <span className="user-role">View Profile</span>
          </div>
        </Link>
        <button className="logout-btn">
            <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};