import { Link } from "react-router-dom";
import { GraduationCap, Users, Lightbulb } from "lucide-react";
import "../styles/LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Swap Skills.<br /><span>Grow Together.</span></h1>
          <p>Connect with others to teach what you know and learn what you need. Build meaningful connections through skill sharing.</p>
          <div className="hero-buttons">
            <Link to="/login">
              <button className="btn-primary">Join Now</button>
            </Link>
            <Link to="/skills">
              <button className="btn-outline">Explore Skills</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>How SkillSwap Works</h2>
        <p>Simple steps to start your skill sharing journey</p>
        <div className="features-cards">
          <div className="feature-card">
            <div className="icon-circle blue"><GraduationCap /></div>
            <h3>Learn</h3>
            <p>Discover new skills from passionate teachers in your community.</p>
          </div>
          <div className="feature-card">
            <div className="icon-circle emerald"><Lightbulb /></div>
            <h3>Teach</h3>
            <p>Share your expertise and help others grow. Teaching reinforces your own knowledge.</p>
          </div>
          <div className="feature-card">
            <div className="icon-circle purple"><Users /></div>
            <h3>Connect</h3>
            <p>Build lasting relationships through shared learning experiences.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat">
          <h3>2,500+</h3>
          <p>Active Learners</p>
        </div>
        <div className="stat">
          <h3>150+</h3>
          <p>Skills Available</p>
        </div>
        <div className="stat">
          <h3>5,000+</h3>
          <p>Sessions Completed</p>
        </div>
        <div className="stat">
          <h3>4.9★</h3>
          <p>Average Rating</p>
        </div>
      </section>

   <footer className="footer">
  <div className="footer-columns">
    <div className="footer-column">
      <h4>SkillSwap</h4>
      <p>Connecting learners and teachers worldwide</p>
    </div>
    <div className="footer-column">
      <h5>Platform</h5>
      <ul>
        <li><a href="#">About</a></li>
        <li><a href="#">How it Works</a></li>
        <li><a href="#">Pricing</a></li>
      </ul>
    </div>
    <div className="footer-column">
      <h5>Support</h5>
      <ul>
        <li><a href="#">Contact</a></li>
        <li><a href="#">Help Center</a></li>
        <li><a href="#">Community</a></li>
      </ul>
    </div>
    <div className="footer-column">
      <h5>Legal</h5>
      <ul>
        <li><a href="#">Privacy</a></li>
        <li><a href="#">Terms</a></li>
        <li><a href="#">Safety</a></li>
      </ul>
    </div>
  </div>
  <p className="copyright">&copy; 2024 SkillSwap. All rights reserved.</p>
</footer>

    </div>
  );
}
