import { Link } from "react-router-dom";
import { GraduationCap, Users, Lightbulb, BarChart, Code, Music, Palette, MoveRight } from "lucide-react";
import "../styles/LandingPage.css";

// Mock data for the new testimonials section
const testimonials = [
    { id: 1, name: "Shrushti P.", role: "Aspiring Developer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shrushti", quote: "SkillSwap connected me with an amazing mentor who helped me crack my first tech interview. The one-on-one guidance is a game-changer!" },
    { id: 2, name: "Prajwal G.", role: "Senior Engineer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Prajwal", quote: "Teaching on this platform has been incredibly rewarding. It reinforces my own knowledge and allows me to give back to the tech community." },
    { id: 3, name: "Rahul S.", role: "Product Manager", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul", quote: "I needed to quickly learn SQL for my new role, and I found a mentor within hours. This is so much more effective than watching videos." }
];

export default function LandingPage() {
  return (
    <div className="landing-page-wrapper">
      <header className="main-header">
        <div className="container">
          <Link to="/" className="logo">SkillSwap</Link>
          <nav className="main-nav">
            <a href="#features">How it Works</a>
            <a href="#skills">Skills</a>
            <Link to="/login" className="nav-btn-outline">Sign In</Link>
          
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-background-shapes"></div>
          <div className="container hero-content">
            <h1 className="hero-title">Learn Anything.<br /><span>Teach Anyone.</span></h1>
            <p className="hero-subtitle">Connect with industry experts for real-time, one-on-one mentorship. Stop searching, start learning.</p>
            <div className="hero-buttons">
              <Link to="/signup" className="btn-primary-hero">Start Your Journey <MoveRight size={20}/></Link>
              <Link to="/skills" className="btn-secondary-hero">Explore Mentors</Link>
            </div>
          </div>
        </section>

        <section id="features" className="features-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">How SkillSwap Works</h2>
              <p className="section-subtitle">A simple, intuitive process to connect you with the right mentor.</p>
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
        
        <section id="skills" className="featured-skills-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Endless Possibilities</h2>
                    <p className="section-subtitle">Explore a diverse range of mentorship topics available on our platform.</p>
                </div>
                <div className="skills-grid">
                    <div className="skill-category-card"><Code size={40} /><h4>Programming</h4></div>
                    <div className="skill-category-card"><BarChart size={40} /><h4>Interview Prep</h4></div>
                    <div className="skill-category-card"><Palette size={40} /><h4>UI/UX Design</h4></div>
                    <div className="skill-category-card"><Music size={40} /><h4>Dance</h4></div>
                </div>
            </div>
        </section>

        {/* NEW: Testimonials Section */}
        <section className="testimonials-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Trusted by the Community</h2>
                    <p className="section-subtitle">Hear what our members have to say about their experience.</p>
                </div>
                <div className="testimonials-grid">
                    {testimonials.map(t => (
                        <div key={t.id} className="testimonial-card">
                            <p className="testimonial-quote">"{t.quote}"</p>
                            <div className="testimonial-author">
                                <img src={t.avatar} alt={t.name} className="author-avatar"/>
                                <div>
                                    <h4 className="author-name">{t.name}</h4>
                                    <p className="author-role">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        
        {/* NEW: Call to Action Section */}
        <section className="cta-section">
            <div className="container">
                <h2 className="cta-title">Ready to Start Your Journey?</h2>
                <p className="cta-subtitle">Join thousands of learners and mentors today. Your next skill is just a conversation away.</p>
                <Link to="/signup" className="btn-primary-hero">Join SkillSwap for Free</Link>
            </div>
        </section>
      </main>

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

