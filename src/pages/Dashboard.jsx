import Sidebar from "../components/Sidebar";
import "../styles/DashboardPage.css";

export default function Dashboard() {
  return (
    <div className="landing-page"> {/* use same root class for styling consistency */}
      <Sidebar />

      <div className="dashboard-content">
        <h1>Dashboard</h1>
        <p>Welcome back, Harshal! Here’s what you can do today:</p>

        <div className="features-cards">
          <div className="feature-card">
            <div className="icon-circle blue">🎯</div>
            <h3>Find a Skill</h3>
            <p>Explore new skills to learn from other members of the community.</p>
          </div>
          <div className="feature-card">
            <div className="icon-circle emerald">💡</div>
            <h3>Offer a Skill</h3>
            <p>Share your expertise and teach others what you know best.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
