// src/pages/SkillsPage.jsx

import { useState } from "react";
import Sidebar from "../components/Sidebar"; // Assuming sidebar is in components folder
import "../styles/SkillListings.css"; // We'll create this new CSS file

// Mock data (added a few more examples)
const mockSkills = [
  {
    id: "1",
    name: "React for Beginners",
    description: "Learn the fundamentals of React, including components, state, and props.",
    teacherName: "Harshal Nakade",
    teacherAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Harshal",
    category: "Programming",
    level: "Beginner",
    format: "Online",
    duration: "4 weeks",
    rating: 4.8,
  },
  {
    id: "2",
    name: "Acoustic Guitar Mastery",
    description: "Start your journey with chords, strumming patterns, and your first songs.",
    teacherName: "Santoshi Patil",
    teacherAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Santoshi",
    category: "Music",
    level: "Beginner",
    format: "In-Person",
    duration: "6 weeks",
    rating: 4.9,
  },
  {
    id: "3",
    name: "Data Science with Python",
    description: "Dive into data analysis, visualization, and machine learning with Python.",
    teacherName: "Rahul Singh",
    teacherAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    category: "Data Science",
    level: "Intermediate",
    format: "Hybrid",
    duration: "8 weeks",
    rating: 4.7,
  },
  {
    id: "4",
    name: "Conversational Spanish",
    description: "Learn practical Spanish for travel and daily conversations.",
    teacherName: "Maria Garcia",
    teacherAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    category: "Languages",
    level: "Beginner",
    format: "Online",
    duration: "10 weeks",
    rating: 4.6,
  },
];


export default function SkillsPage() {
  const [skills] = useState(mockSkills);
  const [filters, setFilters] = useState({
    category: "all",
    level: "all",
    format: "all",
    search: ""
  });

  // Filtering logic remains the same, it's efficient
  const filteredSkills = skills.filter(skill => {
    const matchesCategory = filters.category === "all" || skill.category.toLowerCase() === filters.category.toLowerCase();
    const matchesLevel = filters.level === "all" || skill.level.toLowerCase() === filters.level.toLowerCase();
    const matchesFormat = filters.format === "all" || skill.format.toLowerCase() === filters.format.toLowerCase();
    const matchesSearch = filters.search === "" ||
      skill.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      skill.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      skill.teacherName.toLowerCase().includes(filters.search.toLowerCase());

    return matchesCategory && matchesLevel && matchesFormat && matchesSearch;
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const clearFilters = () => {
    setFilters({ category: "all", level: "all", format: "all", search: "" });
  };

  return (
    <div className="skills-page-container">
      <Sidebar />

      <main className="skills-main-content">
        <header className="skills-header">
          <h1 className="skills-title">Explore Skills</h1>
          <p className="skills-subtitle">Find your next passion from our expert-led sessions.</p>
        </header>

        {/* Filters Bar */}
        <div className="filters-bar">
          <div className="filter-group search-filter">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search by skill, topic, or teacher..."
              value={filters.search}
              onChange={e => handleFilterChange("search", e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select value={filters.category} onChange={e => handleFilterChange("category", e.target.value)}>
              <option value="all">All Categories</option>
              <option value="Programming">Programming</option>
              <option value="Music">Music</option>
              <option value="Languages">Languages</option>
              <option value="Data Science">Data Science</option>
            </select>
          </div>
          <div className="filter-group">
            <select value={filters.level} onChange={e => handleFilterChange("level", e.target.value)}>
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="filter-group">
            <select value={filters.format} onChange={e => handleFilterChange("format", e.target.value)}>
              <option value="all">All Formats</option>
              <option value="Online">Online</option>
              <option value="In-Person">In-Person</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        {/* Skills Grid */}
        {filteredSkills.length > 0 ? (
          <div className="skills-grid">
            {filteredSkills.map(skill => (
              <div key={skill.id} className="skill-card">
                <div className="skill-card-header">
                  <div className="teacher-info">
                    <img src={skill.teacherAvatar} alt={skill.teacherName} className="teacher-avatar" />
                    <span>{skill.teacherName}</span>
                  </div>
                  <div className="skill-rating">⭐ {skill.rating}</div>
                </div>
                <div className="skill-card-body">
                  <h3 className="skill-name">{skill.name}</h3>
                  <p className="skill-description">{skill.description}</p>
                </div>
                <div className="skill-card-footer">
                  <div className="skill-tags">
                    <span className="tag tag-level">{skill.level}</span>
                    <span className="tag tag-format">{skill.format}</span>
                    <span className="tag tag-duration">{skill.duration}</span>
                  </div>
                  <button className="btn-request">Request Session</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
             <h3>No Skills Found</h3>
             <p>Try adjusting your search or filter criteria to find what you're looking for.</p>
             <button onClick={clearFilters} className="btn-clear-filters">
               Clear All Filters
             </button>
          </div>
        )}
      </main>
    </div>
  );
}