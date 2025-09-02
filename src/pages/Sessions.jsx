import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { X, Star } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import "../styles/SessionsPage.css";

// A simple modal for leaving a review, now connected to Firestore
const ReviewModal = ({ session, onClose }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const { currentUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            alert("Please select a star rating.");
            return;
        }
        try {
            // Add a new document to the 'reviews' collection
            await addDoc(collection(db, "reviews"), {
                skillId: session.skillId,
                mentorId: session.mentorId,
                learnerId: currentUser.uid,
                learnerName: currentUser.name || currentUser.displayName,
                rating,
                comment,
                createdAt: serverTimestamp(),
            });
            alert("Thank you for your review!");
            onClose();
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review. Please try again.");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}><X size={24} /></button>
                <h3>Leave a Review for</h3>
                <h2>{session.skillName}</h2>
                <p>with {session.mentorName}</p>
                <form onSubmit={handleSubmit} className="review-form">
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                                key={star}
                                size={32}
                                className={star <= rating ? 'filled' : ''}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>
                    <textarea 
                        rows="4" 
                        placeholder="Share your experience..." 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-primary">Submit Review</button>
                </form>
            </div>
        </div>
    );
};

// This function checks if an upcoming session's date has passed
const getDynamicStatus = (session) => {
    if (session.status !== 'Upcoming' || !session.sessionTime) {
        return session.status;
    }
    const sessionDate = session.sessionTime.toDate();
    const now = new Date();
    return sessionDate < now ? 'Completed' : 'Upcoming';
};

export default function Sessions() {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [reviewingSession, setReviewingSession] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    
    const learnerQuery = query(collection(db, "sessions"), where("learnerId", "==", currentUser.uid));
    const mentorQuery = query(collection(db, "sessions"), where("mentorId", "==", currentUser.uid));

    const processSnapshot = (snapshot, userRole) => {
        const fetchedSessions = snapshot.docs.map(doc => {
            const data = doc.data();
            const dynamicStatus = getDynamicStatus(data);
            return { id: doc.id, ...data, status: dynamicStatus, userRole };
        });

        setSessions(prevSessions => {
            const newSessionsMap = new Map(fetchedSessions.map(s => [s.id, s]));
            const otherSessions = prevSessions.filter(s => !newSessionsMap.has(s.id));
            return [...otherSessions, ...fetchedSessions];
        });
        setLoading(false);
    };

    const unsubscribeLearner = onSnapshot(learnerQuery, (snapshot) => processSnapshot(snapshot, 'Learner'));
    const unsubscribeMentor = onSnapshot(mentorQuery, (snapshot) => processSnapshot(snapshot, 'Mentor'));

    return () => {
        unsubscribeLearner();
        unsubscribeMentor();
    };
  }, [currentUser]);

  const handleAccept = async (sessionId) => {
    const sessionRef = doc(db, "sessions", sessionId);
    await updateDoc(sessionRef, { status: "Upcoming" });
  };

  const handleDecline = async (sessionId) => {
    if (window.confirm("Are you sure you want to decline this session request?")) {
        await deleteDoc(doc(db, "sessions", sessionId));
    }
  };

  const filteredSessions = sessions.filter(
    (session) => session.status === activeTab
  );
  
  const formatDate = (dateObject) => {
    if (!dateObject || !dateObject.toDate) return "Date TBD";
    return dateObject.toDate().toLocaleString("en-US", {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="sessions-page-container">
      <Sidebar />
      <main className="sessions-main-content main-content-area">
        <header className="sessions-header">
          <h1 className="sessions-title">My Sessions</h1>
          <Link to="/skills" className="btn-new-session">Request New Session</Link>
        </header>

        <div className="sessions-container">
          <div className="sessions-tabs">
            <button className={`tab ${activeTab === "Upcoming" ? "active" : ""}`} onClick={() => setActiveTab("Upcoming")}>Upcoming</button>
            <button className={`tab ${activeTab === "Pending" ? "active" : ""}`} onClick={() => setActiveTab("Pending")}>Pending</button>
            <button className={`tab ${activeTab === "Completed" ? "active" : ""}`} onClick={() => setActiveTab("Completed")}>Completed</button>
          </div>

          <div className="sessions-list">
            {loading ? ( <div className="loading-state">Loading sessions...</div> )
             : filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <div key={session.id} className="session-item">
                  <div className="session-details">
                    <h3 className="session-skill">{session.skillName}</h3>
                    <p className="session-participant">
                      {session.userRole === 'Mentor' ? 'Mentoring' : 'Learning from'} <strong>{session.userRole === 'Mentor' ? session.learnerName : session.mentorName}</strong>
                    </p>
                  </div>
                  <div className="session-meta">
                     <span className="session-date">{formatDate(session.sessionTime)}</span>
                     <span className="session-format">{session.format || 'Online'}</span>
                  </div>
                  <div className="session-status">
                    <span className={`status-badge ${session.status.toLowerCase()}`}>{session.status}</span>
                  </div>
                  <div className="session-actions">
                     {session.status === 'Upcoming' && <a href={session.meetingLink || "#"} target="_blank" rel="noopener noreferrer" className="btn-primary">Join Session</a>}
                     {session.status === 'Pending' && session.userRole === 'Mentor' && (
                        <>
                            <button className="btn-secondary" onClick={() => handleDecline(session.id)}>Decline</button>
                            <button className="btn-primary" onClick={() => handleAccept(session.id)}>Accept</button>
                        </>
                     )}
                     {session.status === 'Completed' && session.userRole === 'Learner' && <button className="btn-primary" onClick={() => setReviewingSession(session)}>Leave a Review</button>}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-sessions">
                <p>You have no {activeTab.toLowerCase()} sessions.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {reviewingSession && (
        <ReviewModal session={reviewingSession} onClose={() => setReviewingSession(null)} />
      )}
    </div>
  );
}

