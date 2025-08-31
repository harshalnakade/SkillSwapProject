import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar">
      <h2 style={{padding:"8px"}}>SkillSwap</h2>
      <Link to="/">Home</Link>
      <Link to="/login">Login</Link>
      <Link to="/dashboard">Dashboard</Link>
    </div>
  );
}
