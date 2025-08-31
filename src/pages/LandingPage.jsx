// src/pages/LandingPage.jsx

import { Link } from "react-router-dom";
import { GraduationCap, Users, Lightbulb, BarChart, Code, Music, Palette } from "lucide-react";
import "../styles/LandingPage.css"; // Use the updated CSS below

export default function LandingPage() {
  return (
    <div className="landing-page-wrapper">
      {/* === Navigation Bar === */}
      <header className="main-header">
        <div className="container">
          <Link to="/" className="logo">SkillSwap</Link>
          <nav className="main-nav">
            <a href="#features">How it Works</a>
            <a href="#skills">Skills</a>
            <Link to="/login" className="nav-btn-outline">Sign In</Link>
            {/* Corrected this link to point to /signup */}
           
          </nav>
        </div>
      </header>

      <main>
        {/* === Hero Section === */}
        <section className="hero-section">
          <div className="container hero-content">
            <h1 className="hero-title">
              Learn Anything.
              <br />
              <span>Teach Anyone.</span>
            </h1>
            <p className="hero-subtitle">
              Connect with a global community to share your expertise and discover new passions.
            </p>
            <div className="hero-buttons">
              <Link to="/login" className="btn-primary-hero">Start Your Journey</Link>
              <Link to="/skills" className="btn-secondary-hero">Explore Skills</Link>
            </div>
          </div>
        </section>

        {/* === Features Section === */}
        <section id="features" className="features-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">How SkillSwap Works</h2>
              <p className="section-subtitle">A simple, intuitive process to get you started.</p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon learn-icon"><GraduationCap size={32} /></div>
                <h3 className="feature-title">Discover & Learn</h3>
                <p className="feature-description">Browse through hundreds of skills and find the perfect mentor to guide you.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon teach-icon"><Lightbulb size={32} /></div>
                <h3 className="feature-title">Share & Teach</h3>
                <p className="feature-description">Offer your skills, create sessions, and empower others with your knowledge.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon connect-icon"><Users size={32} /></div>
                <h3 className="feature-title">Connect & Grow</h3>
                <p className="feature-description">Build meaningful connections and grow together in a supportive community.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* === Featured Skills Section === */}
        <section id="skills" className="featured-skills-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Endless Possibilities</h2>
                    <p className="section-subtitle">Explore a diverse range of skills available on our platform.</p>
                </div>
                <div className="skills-grid">
                    <div className="skill-category-card">
                        <Code size={40} />
                        <h4>Programming</h4>
                    </div>
                    <div className="skill-category-card">
                        <Music size={40} />
                        <h4>Music</h4>
                    </div>
                    <div className="skill-category-card">
                        <Palette size={40} />
                        <h4>Design</h4>
                    </div>
                    <div className="skill-category-card">
                        <BarChart size={40} />
                        <h4>Business</h4>
                    </div>
                </div>
            </div>
        </section>

        {/* === Stats Section === */}
        <section className="stats-section">
          <div className="container stats-grid">
            <div className="stat-item">
              <h3>2,500+</h3>
              <p>Active Learners</p>
            </div>
            <div className="stat-item">
              <h3>150+</h3>
              <p>Skills Available</p>
            </div>
            <div className="stat-item">
              <h3>5,000+</h3>
              <p>Sessions Completed</p>
            </div>
            <div className="stat-item">
              <h3>4.9 ★</h3>
              <p>Average Rating</p>
            </div>
          </div>
        </section>
      </main>

      {/* === Footer === */}
      <footer className="main-footer">
        <div className="container footer-content">
          <div className="footer-about">
            <h4 className="logo">SkillSwap</h4>
            <p>Connecting learners and teachers worldwide.</p>
          </div>
          <div className="footer-links">
            <div>
              <h5>Platform</h5>
              <ul>
                <li><a href="#features">How it Works</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#">Community</a></li>
              </ul>
            </div>
            <div>
              <h5>Support</h5>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Safety</a></li>
              </ul>
            </div>
            <div>
              <h5>Legal</h5>
              <ul>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>&copy; {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}