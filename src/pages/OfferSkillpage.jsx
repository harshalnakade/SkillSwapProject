
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { BookOpen, Type, Calendar, Check, PlusCircle, X } from 'lucide-react';
import "../styles/OfferSkillPage.css";

const STEPS = [
  { id: 1, title: "Skill Details", icon: <BookOpen/> },
  { id: 2, title: "Description & Syllabus", icon: <Type/> },
  { id: 3, title: "Set Availability", icon: <Calendar/> },
  { id: 4, title: "Review & Submit", icon: <Check/> },
];

// Modal for adding a new category
const AddCategoryModal = ({ onClose, onAddCategory }) => {
    const [newCategory, setNewCategory] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newCategory.trim()) {
            onAddCategory(newCategory.trim());
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}><X size={24} /></button>
                <h3>Add New Category</h3>
                <form onSubmit={handleSubmit} className="add-category-form">
                    <input 
                        type="text" 
                        placeholder="e.g., UI/UX Design"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" className="btn-primary">Add Category</button>
                </form>
            </div>
        </div>
    );
};


export default function OfferSkillPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState([
      "Backend Development",
      "Full Stack Development",
      "Interview Prep",
      "Career Guidance"
  ]);

  const [formData, setFormData] = useState({
    skillName: "",
    category: "Backend Development",
    level: "Beginner",
    description: "",
    syllabus: ["", "", ""], // Start with 3 empty syllabus items
    availability: {
      Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: []
    }
  });

  const handleAddNewCategory = (newCategory) => {
      if (!categories.includes(newCategory)) {
          setCategories(prev => [...prev, newCategory]);
      }
      setFormData(prev => ({ ...prev, category: newCategory }));
      setCategoryModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSyllabusChange = (index, value) => {
    const newSyllabus = [...formData.syllabus];
    newSyllabus[index] = value;
    setFormData(prev => ({ ...prev, syllabus: newSyllabus }));
  };
  
  const handleAvailabilityChange = (day, time) => {
      setFormData(prev => {
          const daySlots = prev.availability[day];
          const updatedSlots = daySlots.includes(time)
              ? daySlots.filter(slot => slot !== time)
              : [...daySlots, time];
          return { ...prev, availability: { ...prev.availability, [day]: updatedSlots }};
      });
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Submitting New Skill:", formData);
      // Here you would send the data to your backend
      alert("Skill submitted successfully!");
      navigate("/dashboard");
  };

  const timeSlots = ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

  return (
    <div className="offer-skill-page-container">
      <Sidebar />
      <main className="offer-skill-main-content">
        <header className="offer-skill-header">
          <h1>Offer a New Skill</h1>
          <p>Share your expertise with the community. Follow the steps below.</p>
        </header>

        <div className="form-wrapper">
          {/* Step Indicator */}
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
                      <input key={index} type="text" placeholder={`Topic ${index + 1}`} value={item} onChange={(e) => handleSyllabusChange(index, e.target.value)} />
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Availability */}
            {currentStep === 3 && (
                <div className="form-step">
                    <label>Set Your Weekly Availability</label>
                    <p className="form-subtitle">Select the time slots you are generally available for one-on-one sessions.</p>
                    <div className="availability-form-grid">
                        {Object.keys(formData.availability).map(day => (
                            <div key={day} className="day-column">
                                <h5>{day}</h5>
                                <div className="time-slots">
                                    {timeSlots.map(time => (
                                        <button type="button" key={time}
                                            className={`time-slot-btn ${formData.availability[day].includes(time) ? 'selected' : ''}`}
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

            {/* Navigation Buttons */}
            <div className="form-navigation">
              {currentStep > 1 && <button type="button" className="btn-secondary" onClick={prevStep}>Back</button>}
              {currentStep < STEPS.length && <button type="button" className="btn-primary" onClick={nextStep}>Next</button>}
              {currentStep === STEPS.length && <button type="submit" className="btn-primary">Submit Skill</button>}
            </div>
          </form>
        </div>
      </main>
      
      {isCategoryModalOpen && <AddCategoryModal onAddCategory={handleAddNewCategory} onClose={() => setCategoryModalOpen(false)} />}
    </div>
  );
}