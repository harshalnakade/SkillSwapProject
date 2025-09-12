import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import {
  Search,
  BookOpen,
  BarChart,
  X,
  Star,
  ShieldCheck,
  MessageSquare,
  UserCheck,
  CalendarCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  where,
  getDocs,
} from "firebase/firestore";
import "../styles/SkillListings.css";

// ===== Skill Detail Modal =====
const SkillDetailModal = ({ skill, onClose }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleStartConversation = async () => {
    if (!currentUser) return navigate("/login");
    if (currentUser.uid === skill.teacherId) {
      alert("You cannot message yourself.");
      return;
    }
    const convoId = [currentUser.uid, skill.teacherId].sort().join("_");
    try {
      const convoRef = doc(db, "conversations", convoId);
      const convoSnap = await getDoc(convoRef);
      if (!convoSnap.exists()) {
        await setDoc(convoRef, {
          participants: [currentUser.uid, skill.teacherId],
          participantNames: [
            currentUser.displayName || "User",
            skill.teacherName,
          ],
         participantAvatars: [
  currentUser.customData?.avatar || currentUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.uid}`,
  skill.teacherAvatar,
],
          topic: skill.skillName,
          skillId: skill.id,
          lastMessage: "Conversation started.",
          lastTimestamp: serverTimestamp(),
        });
      }
      navigate("/messages", { state: { activeConvoId: convoId } });
    } catch (error) {
      console.error("Error starting conversation:", error);
      alert(
        "Could not start a conversation. Please check your Firestore security rules."
      );
    }
  };
  if (!skill) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <div className="modal-teacher-info">
            <img
              src={skill.teacherAvatar}
              alt={skill.teacherName}
              className="modal-teacher-avatar"
            />
            <div>
              <h3 className="modal-teacher-name">{skill.teacherName}</h3>
              <div className="modal-teacher-badges">
                {skill.isVerified && (
                  <span className="verified-badge-modal">
                    <ShieldCheck size={16} /> Verified
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="modal-rating">
            <Star size={20} className="star-icon" /> {skill.rating || "New"}
          </div>
        </div>

        {/* ================================================================== */}
        {/* STRUCTURAL CHANGE: Added .modal-body to wrap the main content     */}
        {/* This enables the flexbox layout and proper scrolling.            */}
        {/* ================================================================== */}
        <div className="modal-body">
          <h2 className="modal-skill-title">{skill.skillName}</h2>
          <p className="modal-teacher-bio">{skill.description}</p>

          <div className="modal-section">
            <h4 className="modal-section-title">What you'll cover</h4>
            <ul className="syllabus-list">
              {skill.syllabus?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="modal-section">
            <h4 className="modal-section-title">Mentor Stats</h4>
            <div className="mentor-stats">
              {/* ================================================================== */}
              {/* STRUCTURAL CHANGE: Updated the stat-item layout for better styling */}
              {/* ================================================================== */}
              <div className="stat-item">
                <CalendarCheck size={32} />
                <div className="stat-text">
                  <strong>{skill.mentorStats?.sessionsCompleted || 0}</strong>
                  <span>Sessions Completed</span>
                </div>
              </div>
              <div className="stat-item">
                <UserCheck size={32} />
                <div className="stat-text">
                  <strong>{skill.mentorStats?.studentsHelped || 0}</strong>
                  <span>Students Helped</span>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-section">
            <h4 className="modal-section-title">
              Reviews ({skill.reviews?.length || 0})
            </h4>
            <div className="reviews-list">
              {skill.reviews && skill.reviews.length > 0 ? (
                skill.reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <span className="review-author">{review.authorName}</span>
                      <div className="review-rating">
                        <Star size={16} className="star-icon" /> {review.rating}
                      </div>
                    </div>
                    <p className="review-comment">"{review.comment}"</p>
                  </div>
                ))
              ) : (
                <p>No reviews yet for this mentor.</p>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={handleStartConversation} className="btn-message-modal">
            <MessageSquare size={20} /> Message Mentor
          </button>
          <Link to={`/book/${skill.id}`} className="btn-request-modal">
            Request Session
          </Link>
        </div>
      </div>
    </div>
  );
};

// ===== Skills Page =====
export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [filters, setFilters] = useState({
    category: "all",
    level: "all",
    search: "",
  });

  useEffect(() => {
    setLoading(true);
    const skillsCollectionRef = collection(db, "skills");
    const q = query(skillsCollectionRef);

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const skillsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const enrichedSkills = await Promise.all(
        skillsData.map(async (skill) => {
          if (!skill.teacherId) {
            return {
              ...skill,
              mentorStats: { sessionsCompleted: 0, studentsHelped: 0 },
              reviews: [],
              rating: "New",
            };
          }

          const sessionsQuery = query(
            collection(db, "sessions"),
            where("mentorId", "==", skill.teacherId),
            where("status", "==", "Completed")
          );
          const sessionsSnap = await getDocs(sessionsQuery);
          const sessionsCompleted = sessionsSnap.size;

          const studentIds = new Set(
            sessionsSnap.docs.map((doc) => doc.data().learnerId)
          );
          const studentsHelped = studentIds.size;

          const reviewsQuery = query(
            collection(db, "reviews"),
            where("mentorId", "==", skill.teacherId)
          );
          const reviewsSnap = await getDocs(reviewsQuery);
          const reviewsData = reviewsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const totalRating = reviewsData.reduce(
            (acc, review) => acc + review.rating,
            0
          );
          const avgRating =
            reviewsData.length > 0
              ? (totalRating / reviewsData.length).toFixed(1)
              : "New";

          return {
            ...skill,
            mentorStats: {
              sessionsCompleted: sessionsCompleted,
              studentsHelped: studentsHelped,
            },
            reviews: reviewsData,
            rating: avgRating,
          };
        })
      );

      setSkills(enrichedSkills);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredSkills = skills.filter((skill) => {
    const matchesCategory =
      filters.category === "all" || skill.category === filters.category;
    const matchesLevel =
      filters.level === "all" || skill.level === filters.level;
    const matchesSearch =
      filters.search === "" ||
      (skill.skillName &&
        skill.skillName.toLowerCase().includes(filters.search.toLowerCase())) ||
      (skill.teacherName &&
        skill.teacherName
          .toLowerCase()
          .includes(filters.search.toLowerCase()));
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));
  const clearFilters = () =>
    setFilters({ category: "all", level: "all", search: "" });

  return (
    <div className="skills-page-container">
      <Sidebar />
      <main className="skills-main-content main-content-area">
        <header className="skills-header">
          <h1 className="skills-title">Explore Mentorship</h1>
          <p className="skills-subtitle">
            Connect with industry experts for one-on-one guidance.
          </p>
        </header>

        <div className="filters-bar">
          <div className="filter-group search-filter">
            <Search size={20} className="filter-icon" />
            <input
              type="text"
              placeholder="Search by topic or mentor..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>
          <div className="filter-group">
            <BookOpen size={20} className="filter-icon" />
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Backend Development">Backend Development</option>
              <option value="Full Stack Development">
                Full Stack Development
              </option>
              <option value="Interview Prep">Interview Prep</option>
              <option value="Career Guidance">Career Guidance</option>
            </select>
          </div>
          <div className="filter-group">
            <BarChart size={20} className="filter-icon" />
            <select
              value={filters.level}
              onChange={(e) => handleFilterChange("level", e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : filteredSkills.length > 0 ? (
          <div className="skills-grid">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="skill-card"
                onClick={() => setSelectedSkill(skill)}
              >
                <div className="skill-card-header">
                  <div className="teacher-info">
                    <img
                      src={skill.teacherAvatar}
                      alt={skill.teacherName}
                      className="teacher-avatar"
                    />
                    <div>
                      <span className="teacher-name">{skill.teacherName}</span>
                      {skill.isVerified && (
                        <span
                          className="verified-badge"
                          title="Verified Teacher"
                        >
                          <ShieldCheck size={14} /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="skill-rating">
                    <Star size={16} className="star-icon" />{" "}
                    {skill.rating || "New"}
                  </div>
                </div>
                <div className="skill-card-body">
                  <h3 className="skill-name">{skill.skillName}</h3>
                  <div className="skill-reviews-preview">
                    {skill.reviews && skill.reviews.length > 0 ? (
                      skill.reviews.slice(0, 2).map((review) => (
                        <div key={review.id} className="review-snippet">
                          <div className="review-snippet-header">
                            <span className="review-author">
                              {review.authorName}
                            </span>
                            <div className="review-rating-snippet">
                              <Star size={12} className="star-icon" />{" "}
                              {review.rating}
                            </div>
                          </div>
                          <p className="review-comment-snippet">
                            "{review.comment.slice(0, 50)}..."
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="no-reviews">No reviews yet</p>
                    )}
                  </div>
                </div>
                <div className="skill-card-footer">
                  <div className="skill-tags">
                    <span className="tag tag-level">{skill.level}</span>
                  </div>
                  <span className="view-details-link">View Details →</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No Mentors Found</h3>
            <p>
              Try adjusting your search criteria. More mentors are joining every
              day!
            </p>
            <button onClick={clearFilters} className="btn-clear-filters">
              Clear All Filters
            </button>
          </div>
        )}
      </main>

      {selectedSkill && (
        <SkillDetailModal
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
        />
      )}
    </div>
  );
}