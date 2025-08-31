import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar" style={{width:"200px", minHeight:"100vh", float:"left"}}>
      <h3 style={{padding:"8px"}}>Menu</h3>
      <Link to="/profile">Profile</Link>
      <Link to="/skills">Skills</Link>
      <Link to="/sessions">Sessions</Link>
      <Link to="/messages">Messages</Link>
    </div>
  );
}
