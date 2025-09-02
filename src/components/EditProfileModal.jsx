import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { X, Save } from 'lucide-react';
import "./EditProfileModal.css"; // We'll create this CSS file next

export default function EditProfileModal({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill the form when the modal opens or the user changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || currentUser.displayName || "",
        bio: currentUser.bio || "",
        location: currentUser.location || "",
      });
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsLoading(true);

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
      });

      // Note: Updating the core Firebase Auth profile (displayName) is a separate step
      // if needed, but for now, we'll focus on the Firestore data.

      alert("Profile updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><X size={24} /></button>
        <div className="modal-header">
          <h2>Edit Your Profile</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="bio">About Me</label>
            <textarea id="bio" name="bio" rows="4" placeholder="Tell us a little about yourself..." value={formData.bio} onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input type="text" id="location" name="location" placeholder="e.g., Pune, India" value={formData.location} onChange={handleChange} />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? <div className="spinner-light"></div> : <><Save size={18}/> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
