import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Star, Clock, Globe, MapPin } from "lucide-react";
import "../styles/SkillListings.css";

// Mock data
const mockSkills = [
  {
    id: "1",
    name: "Web Development",
    teacherName: "Harshal Nakade",
    teacherAvatar: "",
    level: "Intermediate",
    category: "Programming",
    format: "Online",
    duration: "3h",
    rating: 4.5,
    description: "Learn HTML, CSS, and JavaScript to build websites.",
  },
  {
    id: "2",
    name: "Guitar Basics",
    teacherName: "Santoshi Meshram",
    teacherAvatar: "",
    level: "Beginner",
    category: "Music",
    format: "In-Person",
    duration: "2h",
    rating: 4.0,
    description: "Start learning chords and basic songs on the guitar.",
  },
];

export default function SkillListings() {
  const [skills] = useState(mockSkills);
  const [filters, setFilters] = useState({
    category: "all",
    level: "all",
    format: "all",
    search: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredSkills = skills.filter((skill) => {
    const matchesCategory =
      filters.category === "all" ||
      skill.category.toLowerCase() === filters.category.toLowerCase();
    const matchesLevel =
      filters.level === "all" ||
      skill.level.toLowerCase() === filters.level.toLowerCase();
    const matchesFormat =
      filters.format === "all" ||
      skill.format.toLowerCase() === filters.format.toLowerCase();
    const matchesSearch =
      filters.search === "" ||
      skill.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      skill.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      skill.teacherName.toLowerCase().includes(filters.search.toLowerCase());

    return matchesCategory && matchesLevel && matchesFormat && matchesSearch;
  });

  const getCategoryColor = (category) => {
    const colors = {
      Programming: "blue",
      "Data Science": "green",
      Design: "purple",
      Languages: "yellow",
      Business: "orange",
      Music: "pink",
    };
    return colors[category] || "gray";
  };

  const openModal = (skill) => {
    setSelectedSkill(skill);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedSkill(null);
  };

  return (
    <div className="skill-page">
      <Sidebar />
      <div className="content">
        <h1>Explore Skills</h1>

        {/* Filters */}
        <div className="filters">
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Business">Business</option>
            <option value="Music">Music</option>
            <option value="Languages">Languages</option>
            <option value="Data Science">Data Science</option>
          </select>

          <select
            value={filters.level}
            onChange={(e) => handleFilterChange("level", e.target.value)}
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>

          <select
            value={filters.format}
            onChange={(e) => handleFilterChange("format", e.target.value)}
          >
            <option value="all">All Formats</option>
            <option value="Online">Online</option>
            <option value="In-Person">In-Person</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <input
            type="text"
            placeholder="Search skills..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
        </div>

        {/* Skills Grid */}
        <div className="skills-grid">
          {filteredSkills.map((skill) => (
            <div key={skill.id} className="skill-card">
              <div className="card-header">
                <div className="avatar">
                  {skill.teacherAvatar ? (
                    <img src={skill.teacherAvatar} alt={skill.teacherName} />
                  ) : (
                    <div className="fallback">
                      {skill.teacherName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  )}
                </div>
                <div className="info">
                  <h3>{skill.name}</h3>
                  <p>by {skill.teacherName}</p>
                </div>
                <div className="rating-level">
                  <div>
                    <Star />
                    <span>{skill.rating}</span>
                  </div>
                  <span>{skill.level}</span>
                </div>
              </div>

              <p>{skill.description}</p>

              <div className="card-footer">
                <div className="details">
                  <div>
                    <Clock /> {skill.duration}
                  </div>
                  <div>
                    {skill.format === "Online" ? <Globe /> : <MapPin />}{" "}
                    {skill.format}
                  </div>
                </div>
                <div
                  className="category-badge"
                  style={{ backgroundColor: getCategoryColor(skill.category) }}
                >
                  {skill.category}
                </div>
              </div>

              <button className="request-btn" onClick={() => openModal(skill)}>
                Request Session
              </button>
            </div>
          ))}
        </div>

        {/* Load More / Empty State */}
        {filteredSkills.length === 0 && (
          <div className="empty-state">
            <p>No skills found matching your criteria.</p>
            <button
              onClick={() =>
                setFilters({ category: "all", level: "all", format: "all", search: "" })
              }
            >
              Clear Filters
            </button>
          </div>
        )}

        {filteredSkills.length > 0 && (
          <div className="load-more">
            <button>Load More Skills</button>
          </div>
        )}
      </div>

      {/* Built-in Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedSkill?.name}</h2>
            <p>Teacher: {selectedSkill?.teacherName}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
