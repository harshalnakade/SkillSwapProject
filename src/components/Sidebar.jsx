
import { Link, NavLink } from "react-router-dom";
import { LayoutDashboard, BookOpen, Calendar, MessageSquare, PlusCircle, LogOut, Search } from 'lucide-react';
import './Sidebar.css';

// Mock user data now includes roles for conditional rendering
const mockUser = {
  name: "Harshal Nakade",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harshal",
  roles: ['learner', 'teacher'], // This user can both learn and teach
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
          <li><NavLink to="/dashboard" className="menu-item"><LayoutDashboard size={20} /><span>Dashboard</span></NavLink></li>
          <li><NavLink to="/skills" className="menu-item"><BookOpen size={20} /><span>Explore Skills</span></NavLink></li>
          <li><NavLink to="/sessions" className="menu-item"><Calendar size={20} /><span>My Sessions</span></NavLink></li>
          <li><NavLink to="/messages" className="menu-item"><MessageSquare size={20} /><span>Messages</span></NavLink></li>
        </ul>

        {/* === Quick Actions (Now functional and role-based) === */}
        <div className="quick-actions">
           <p className="menu-title">QUICK ACTIONS</p>
           
           {/* This button only shows if the user is a 'teacher' */}
           {mockUser.roles.includes('teacher') && (
             <Link to="/offer-skill" className="action-btn">
               <PlusCircle size={20} />
               <span>Offer a New Skill</span>
             </Link>
           )}

           {/* This button only shows if the user is a 'learner' */}
           {mockUser.roles.includes('learner') && (
            <Link to="/skills" className="action-btn secondary">
               <Search size={20} />
               <span>Find a Mentor</span>
            </Link>
           )}
        </div>
      </div>

      {/* === Sidebar Footer with User Profile === */}
      <div className="sidebar-footer">
        <NavLink to="/profile" className="user-profile-link">
          <img src={mockUser.avatar} alt={mockUser.name} className="user-avatar" />
          <div className="user-info">
            <span className="user-name">{mockUser.name}</span>
            <span className="user-role">View Profile</span>
          </div>
        </NavLink>
        <Link to="/" className="logout-btn">
            <LogOut size={20} />
        </Link>
      </div>
    </nav>
  );
};