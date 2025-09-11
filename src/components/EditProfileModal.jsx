import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { X, Save } from 'lucide-react';
import "./EditProfileModal.css";

// Using names as seeds works best with the "personas" style
const avatarSeeds = [
  "Sophie", "Leo", "Mia", "Zoe", "Alex", "Max", "Ruby", "Oscar",
  "Chloe", "Felix", "Lily", "Jasper", "Eva", "Noah", "Grace"
];

export default function EditProfileModal({ isOpen, onClose }) {
  const { currentUser, refreshUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: "", bio: "", location: "", avatar: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      if (currentUser?.customData) {
        setFormData({
          name: currentUser.customData.name || currentUser.displayName || "",
          bio: currentUser.customData.bio || "",
          location: currentUser.customData.location || "",
          avatar: currentUser.customData.avatar || currentUser.photoURL || "",
        });
      }
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  // UPDATED: Switched to the "personas" style for a professional look
  const avatarOptions = avatarSeeds.map(
  seed => `https://api.dicebear.com/7.x/micah/svg?seed=${seed}`
);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAvatarSelect = (url) => {
    setFormData(prev => ({ ...prev, avatar: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const updatedCustomData = {
        ...currentUser.customData,
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        avatar: formData.avatar,
      };
      await updateDoc(userDocRef, { customData: updatedCustomData });

      if (refreshUser) {
        await refreshUser();
      }
      alert("Profile updated successfully!");
      handleClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className={`modal-content ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose}><X size={24} /></button>
        <div className="modal-header">
          <h2>Edit Your Profile</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-group">
            <label>Choose Your Avatar</label>
            <div className="avatar-selection-grid">
              {avatarOptions.map((url) => (
                <img 
                  key={url}
                  src={url}
                  alt="Avatar option"
                  className={`avatar-option ${formData.avatar === url ? 'selected' : ''}`}
                  onClick={() => handleAvatarSelect(url)}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="bio">About Me</label>
            <textarea id="bio" name="bio" rows="4" value={formData.bio} onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading 
                ? "Saving..." 
                : <><Save size={18}/> Save Changes</>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}