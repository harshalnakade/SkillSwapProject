import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { BookOpen, Type, Calendar, Check, PlusCircle, X, Trash2, Lightbulb } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import "../styles/OfferSkillPage.css";

const STEPS = [
  { id: 1, title: "Skill Details", icon: <BookOpen/> },
  { id: 2, title: "Description & Syllabus", icon: <Type/> },
  { id: 3, title: "Set Availability", icon: <Calendar/> },
  { id: 4, title: "Review & Submit", icon: <Check/> },
];

const AddCategoryModal = ({ onClose, onAddCategory }) => {
    const [newCategory, setNewCategory] = useState("");
    const handleSubmit = (e) => { e.preventDefault(); if (newCategory.trim()) { onAddCategory(newCategory.trim()); } };
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}><X size={24} /></button>
                <h3>Add New Category</h3>
                <form onSubmit={handleSubmit} className="add-category-form">
                    <input type="text" placeholder="e.g., UI/UX Design" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} autoFocus />
                    <button type="submit" className="btn-primary">Add Category</button>
                </form>
            </div>
        </div>
    );
};

export default function OfferSkillPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { skillId } = useParams();
  const isEditMode = !!skillId;

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState([
      "Backend Development", "Full Stack Development", "Interview Prep", "Career Guidance"
  ]);
  const [formData, setFormData] = useState({
    skillName: "", category: "Backend Development", level: "Beginner",
    description: "", syllabus: [""],
    availability: { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] }
  });

  useEffect(() => {
    if (isEditMode && currentUser) {
      const fetchSkillData = async () => {
        setIsLoading(true);
        const docRef = doc(db, "skills", skillId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().teacherId === currentUser.uid) {
          setFormData(docSnap.data());
        } else {
          console.error("Skill not found or you don't have permission to edit it.");
          navigate("/dashboard");
        }
        setIsLoading(false);
      };
      fetchSkillData();
    }
  }, [skillId, isEditMode, currentUser, navigate]);

  const handleAddNewCategory = (newCategory) => { if (!categories.includes(newCategory)) { setCategories(prev => [...prev, newCategory]); } setFormData(prev => ({ ...prev, category: newCategory })); setCategoryModalOpen(false); };
  const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSyllabusChange = (index, value) => { const newSyllabus = [...formData.syllabus]; newSyllabus[index] = value; setFormData(prev => ({ ...prev, syllabus: newSyllabus })); };
  const addSyllabusItem = () => setFormData(prev => ({ ...prev, syllabus: [...prev.syllabus, ""] }));
  const removeSyllabusItem = (index) => { if (formData.syllabus.length > 1) { const newSyllabus = formData.syllabus.filter((_, i) => i !== index); setFormData(prev => ({ ...prev, syllabus: newSyllabus })); } };
  const handleAvailabilityChange = (day, time) => { setFormData(prev => { const daySlots = prev.availability[day] || []; const updatedSlots = daySlots.includes(time) ? daySlots.filter(slot => slot !== time) : [...daySlots, time]; return { ...prev, availability: { ...prev.availability, [day]: updatedSlots }}; }); };
  const nextStep = () => { if (currentStep === 1 && !formData.skillName.trim()) { return alert("Please enter a skill title."); } if (currentStep === 2 && !formData.description.trim()) { return alert("Please enter a description."); } setCurrentStep(prev => Math.min(prev + 1, STEPS.length)); };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!currentUser) return navigate("/login");
      setIsLoading(true);
      try {
          if (isEditMode) {
              const skillRef = doc(db, "skills", skillId);
              await updateDoc(skillRef, { ...formData, updatedAt: serverTimestamp() });
              alert("Skill updated successfully!");
          } else {
              await addDoc(collection(db, "skills"), {
                  teacherId: currentUser.uid,
                  // UPDATED: Access name and avatar from customData, with fallbacks
                  teacherName: currentUser.customData?.name || currentUser.displayName,
                  teacherAvatar: currentUser.customData?.avatar || currentUser.photoURL,
                  ...formData,
                  createdAt: serverTimestamp(),
                  isVerified: true, rating: 0, reviewCount: 0,
              });
              alert("Your skill has been offered successfully!");
          }
          navigate("/profile");
      } catch (error) {
          console.error("Error saving skill:", error);
          alert("Failed to save skill. Please try again.");
      } finally {
          setIsLoading(false);
      }
  };

  const timeSlots = ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];
  // UPDATED: Access roles from customData
  const isTeacher = currentUser?.customData?.roles?.includes('teacher');

  return (
    <div className="offer-skill-page-container">
      <Sidebar />
      <main className="offer-skill-main-content main-content-area">
        <header className="offer-skill-header">
            <h1>{isEditMode ? "Edit Your Skill" : "Offer a New Skill"}</h1>
            <p>{isEditMode ? "Update the details for your skill listing below." : "Share your expertise with the community."}</p>
        </header>

        <div className="form-wrapper">
          {isTeacher ? (
            <>
              <div className="step-indicator">
                {STEPS.map((step, index) => (
                  <div key={step.id} className={`step-item ${currentStep >= step.id ? 'completed' : ''}`}>
                    <div className="step-icon">{step.icon}</div>
                    <span>{step.title}</span>
                    {index < STEPS.length - 1 && <div className="step-connector"></div>}
                  </div>
                ))}
              </div>
              <form onSubmit={handleSubmit}>
                {/* Step 1: Skill Details */}
                {currentStep === 1 && (
                  <div className="form-step">
                    <div className="form-group">
                      <label htmlFor="skillName">Skill / Mentorship Title</label>
                      <input type="text" id="skillName" name="skillName" placeholder="e.g., Java & Spring Boot Fundamentals" value={formData.skillName} onChange={handleChange} required />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="category" className="label-with-action">
                          Category
                          <button type="button" className="btn-add-new" onClick={() => setCategoryModalOpen(true)}>
                            <PlusCircle size={16}/> Add New
                          </button>
                        </label>
                        <select id="category" name="category" value={formData.category} onChange={handleChange}>
                          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label htmlFor="level">Level for Learners</label>
                        <select id="level" name="level" value={formData.level} onChange={handleChange}>
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                          <option>All Levels</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Description & Syllabus */}
                {currentStep === 2 && (
                  <div className="form-step">
                    <div className="form-group">
                      <label htmlFor="description">Detailed Description</label>
                      <textarea id="description" name="description" rows="4" placeholder="Describe what you will teach and who this is for." value={formData.description} onChange={handleChange}></textarea>
                    </div>
                    <div className="form-group">
                      <label>What You'll Cover (Syllabus)</label>
                      {formData.syllabus.map((item, index) => (
                        <div key={index} className="syllabus-item">
                          <input type="text" placeholder={`Topic ${index + 1}`} value={item} onChange={(e) => handleSyllabusChange(index, e.target.value)} />
                          {formData.syllabus.length > 1 && (
                            <button type="button" className="btn-remove" onClick={() => removeSyllabusItem(index)}>
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button type="button" className="btn-add-topic" onClick={addSyllabusItem}>
                        <PlusCircle size={16}/> Add Topic
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Availability */}
                {currentStep === 3 && (
                  <div className="form-step">
                    <label className="form-group-label">Set Your Weekly Availability</label>
                    <p className="form-subtitle">Select the time slots you are generally available for one-on-one sessions.</p>
                    <div className="availability-form-grid">
                      {Object.keys(formData.availability).map(day => (
                        <div key={day} className="day-column">
                          <h5>{day}</h5>
                          <div className="time-slots">
                            {timeSlots.map(time => (
                              <button type="button" key={time}
                                className={`time-slot-btn ${formData.availability[day]?.includes(time) ? 'selected' : ''}`}
                                onClick={() => handleAvailabilityChange(day, time)}>
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Step 4: Review */}
                {currentStep === 4 && (
                  <div className="form-step review-step">
                    <h4>Review Your Listing</h4>
                    <div className="review-item"><strong>Title:</strong> {formData.skillName}</div>
                    <div className="review-item"><strong>Category:</strong> {formData.category}</div>
                    <div className="review-item"><strong>Level:</strong> {formData.level}</div>
                    <div className="review-item"><strong>Description:</strong> {formData.description}</div>
                    <div className="review-item"><strong>Syllabus:</strong> <ul>{formData.syllabus.filter(s => s).map((s,i) => <li key={i}>{s}</li>)}</ul></div>
                  </div>
                )}

                <div className="form-navigation">
                  {currentStep > 1 && <button type="button" className="btn-secondary" onClick={prevStep}>Back</button>}
                  {currentStep < STEPS.length && <button type="button" className="btn-primary" onClick={nextStep}>Next</button>}
                  {currentStep === STEPS.length && (
                    <button type="submit" className="btn-primary" disabled={isLoading}>
                      {isLoading ? <div className="spinner-light"></div> : (isEditMode ? "Update Skill" : "Submit Skill")}
                    </button>
                  )}
                </div>
              </form>
            </>
          ) : (
            <div className="access-denied">
              <Lightbulb size={48} className="access-denied-icon"/>
              <h2>Become a Mentor</h2>
              <p>This page is for users who want to offer their skills. To start teaching, please update your role in your profile settings.</p>
              <Link to="/profile" className="btn-primary">Go to Profile</Link>
            </div>
          )}
        </div>
      </main>
      
      {isCategoryModalOpen && <AddCategoryModal onAddCategory={handleAddNewCategory} onClose={() => setCategoryModalOpen(false)} />}
    </div>
  );
}
