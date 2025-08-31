// src/pages/SkillsPage.jsx

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Search, BookOpen, BarChart, X, Star, ShieldCheck, MessageSquare } from 'lucide-react'; // Added MessageSquare icon
import "../styles/SkillListings.css";

// NEW: Mock data tailored to tech mentorship and career guidance
const mockSkills = [
  {
    id: "1",
    name: "Java & Spring Boot Fundamentals",
    description: "Master backend development with Java and Spring Boot. Perfect for aspiring backend engineers.",
    teacherName: "Harshal Nakade",
    teacherAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harshal",
    teacherBio: "Harshal is a verified Senior Backend Engineer with 7+ years of experience in enterprise Java applications. He's passionate about clean code and helping junior developers grow.",
    teacherExperience: "Senior Level",
    isVerified: true,
    category: "Backend Development",
    level: "Beginner",
    format: "Online",
    rating: 4.9,
    reviews: [
        { id: 1, name: "Prajwal G.", comment: "Harshal's guidance on Spring Security was invaluable. Highly recommend!" },
        { id: 2, name: "Shrushti P.", comment: "Finally understood dependency injection thanks to Harshal." }
    ],
    syllabus: [ "Core Java Concepts", "Spring Framework Basics", "Building REST APIs", "Database Integration with JPA", "Spring Security Fundamentals" ]
  },
  {
    id: "2",
    name: "Full Stack React & Node.js",
    description: "A complete guide to building and deploying a full-stack MERN application from scratch.",
    teacherName: "Santoshi Patil",
    teacherAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Santoshi",
    teacherBio: "As a Full Stack Developer at a fast-growing startup, Santoshi has hands-on experience with modern web technologies and loves mentoring aspiring developers.",
    teacherExperience: "Mid Level",
    isVerified: true,
    category: "Full Stack Development",
    level: "Intermediate",
    format: "Online",
    rating: 4.8,
    reviews: [ { id: 1, name: "Rahul S.", comment: "The project-based approach was fantastic. I learned so much." } ],
    syllabus: [ "Advanced React Hooks", "Node.js & Express Server Setup", "MongoDB Integration", "JWT Authentication", "Deployment to Vercel/Heroku" ]
  },
  {
    id: "3",
    name: "System Design Interview Prep",
    description: "Crack the senior-level system design interview. Discuss scalability, architecture, and trade-offs.",
    teacherName: "Aarav Sharma",
    teacherAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav",
    teacherBio: "Aarav is a Staff Software Engineer at Google with over a decade of experience in distributed systems. He has conducted hundreds of interviews and knows what it takes to succeed.",
    teacherExperience: "Staff Level",
    isVerified: true,
    category: "Interview Prep",
    level: "Advanced",
    format: "Online",
    rating: 5.0,
    reviews: [ { id: 1, name: "Zoya K.", comment: "Aarav's mock interview was tougher than the real one! Invaluable experience." } ],
    syllabus: [ "Scalability Concepts (Horizontal vs. Vertical)", "Database Design (SQL vs. NoSQL)", "Caching Strategies", "Load Balancing and CDNs", "Common Design Patterns (e.g., TinyURL, Twitter)" ]
  },
  {
    id: "4",
    name: "Resume & Portfolio Review",
    description: "Get personalized, actionable feedback on your resume and portfolio from an industry professional.",
    teacherName: "Priya Singh",
    teacherAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    teacherBio: "Priya is a Tech Recruiter with deep insight into what makes a candidate stand out. She helps developers craft compelling narratives to land their dream jobs.",
    teacherExperience: "Industry Professional",
    isVerified: false,
    category: "Career Guidance",
    level: "All Levels",
    format: "Online",
    rating: 4.9,
    reviews: [],
    syllabus: [ "Resume ATS Optimization", "Crafting Project Descriptions", "Highlighting Your Impact", "Portfolio Best Practices", "LinkedIn Profile Review" ]
  },
];


// Skill Detail Modal Component (Now with "Message Teacher" button)
const SkillDetailModal = ({ skill, onClose }) => {
    if (!skill) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}><X size={24} /></button>
                <div className="modal-header">
                    <div className="modal-teacher-info">
                        <img src={skill.teacherAvatar} alt={skill.teacherName} className="modal-teacher-avatar" />
                        <div>
                            <h3 className="modal-teacher-name">{skill.teacherName}</h3>
                            <div className="modal-teacher-badges">
                                {skill.isVerified && <span className="verified-badge-modal"><ShieldCheck size={16} /> Verified</span>}
                                <span className="experience-badge-modal">{skill.teacherExperience}</span>
                            </div>
                        </div>
                    </div>
                    <div className="modal-rating"><Star size={20} className="star-icon"/> {skill.rating}</div>
                </div>
                <h2 className="modal-skill-title">{skill.name}</h2>
                <p className="modal-teacher-bio">{skill.teacherBio}</p>
                
                <div className="modal-section">
                    <h4 className="modal-section-title">What you'll cover</h4>
                    <ul className="syllabus-list">
                        {skill.syllabus.map((item, index) => <li key={index}>{item}</li>)}
                    </ul>
                </div>

                {skill.reviews.length > 0 && (
                    <div className="modal-section">
                        <h4 className="modal-section-title">Reviews from Learners</h4>
                        <div className="reviews-list">
                            {skill.reviews.map(review => (
                                <div key={review.id} className="review-item">
                                    <p className="review-comment">"{review.comment}"</p>
                                    <span className="review-author">- {review.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="modal-footer">
                    <button className="btn-message-modal"><MessageSquare size={20}/> Message Teacher</button>
                    <button className="btn-request-modal">Request Session</button>
                </div>
            </div>
        </div>
    );
};


export default function SkillsPage() {
  const [skills] = useState(mockSkills);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [filters, setFilters] = useState({ category: "all", level: "all", format: "all", search: "" });

  const filteredSkills = skills.filter(skill => {
    const matchesCategory = filters.category === "all" || skill.category === filters.category;
    const matchesLevel = filters.level === "all" || skill.level === filters.level;
    const matchesFormat = filters.format === "all" || skill.format === filters.format;
    const matchesSearch = filters.search === "" ||
      skill.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      skill.teacherName.toLowerCase().includes(filters.search.toLowerCase());
    return matchesCategory && matchesLevel && matchesFormat && matchesSearch;
  });

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters({ category: "all", level: "all", format: "all", search: "" });

  return (
    <div className="skills-page-container">
      <Sidebar />
      <main className="skills-main-content">
        <header className="skills-header">
          <h1 className="skills-title">Explore Mentorship</h1>
          <p className="skills-subtitle">Connect with industry experts for one-on-one guidance.</p>
        </header>

        <div className="filters-bar">
          <div className="filter-group search-filter">
            <Search size={20} className="filter-icon" />
            <input type="text" placeholder="Search by topic or mentor..." value={filters.search} onChange={e => handleFilterChange("search", e.target.value)} />
          </div>
          <div className="filter-group">
            <BookOpen size={20} className="filter-icon" />
            <select value={filters.category} onChange={e => handleFilterChange("category", e.target.value)}>
              <option value="all">All Categories</option>
              <option value="Backend Development">Backend Development</option>
              <option value="Full Stack Development">Full Stack Development</option>
              <option value="Interview Prep">Interview Prep</option>
              <option value="Career Guidance">Career Guidance</option>
            </select>
          </div>
          <div className="filter-group">
            <BarChart size={20} className="filter-icon" />
            <select value={filters.level} onChange={e => handleFilterChange("level", e.target.value)}>
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {filteredSkills.length > 0 ? (
          <div className="skills-grid">
            {filteredSkills.map(skill => (
              <div key={skill.id} className="skill-card" onClick={() => setSelectedSkill(skill)}>
                <div className="skill-card-header">
                  <div className="teacher-info">
                    <img src={skill.teacherAvatar} alt={skill.teacherName} className="teacher-avatar" />
                    <div>
                        <span className="teacher-name">{skill.teacherName}</span>
                        {skill.isVerified && <span className="verified-badge" title="Verified Teacher"><ShieldCheck size={14} /> Verified</span>}
                    </div>
                  </div>
                  <div className="skill-rating"><Star size={16} className="star-icon"/> {skill.rating}</div>
                </div>
                <div className="skill-card-body">
                  <span className="tag tag-experience">{skill.teacherExperience}</span>
                  <h3 className="skill-name">{skill.name}</h3>
                </div>
                <div className="skill-card-footer">
                  <div className="skill-tags">
                    <span className="tag tag-level">{skill.level}</span>
                    <span className="tag tag-format">{skill.format}</span>
                  </div>
                  <span className="view-details-link">View Details &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
             <h3>No Mentors Found</h3>
             <p>Try adjusting your search criteria to find what you're looking for.</p>
             <button onClick={clearFilters} className="btn-clear-filters">Clear All Filters</button>
          </div>
        )}
      </main>
      
      <SkillDetailModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
    </div>
  );
}