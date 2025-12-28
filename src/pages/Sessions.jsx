import { addDoc, collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import "../styles/SessionsPage.css";

const ReviewModal = ({ session, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const { currentUser } = useAuth();

  // Fetch reviews for this session
  useEffect(() => {
    if (!session?.id) return;

    const q = query(
      collection(db, "reviews"),
      where("sessionId", "==", session.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessionReviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(sessionReviews);
    });

    return () => unsubscribe();
  }, [session]);

  // Check if the current user has already reviewed this session
  const hasReviewed = reviews.some(
    (review) => review.learnerId === currentUser.uid
  );

  // Handle review submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }
    try {
      await addDoc(collection(db, "reviews"), {
        sessionId: session.id,           
        skillId: session.skillId,
        mentorId: session.mentorId,
        learnerId: currentUser.uid,
        learnerName: currentUser.name || currentUser.displayName,
        rating,
        comment,
        createdAt: serverTimestamp(),
      });
      alert("Thank you for your review!");
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}><X size={24} /></button>
        <h3>Leave a Review for</h3>
        <h2>{session.skillName}</h2>
        <p>with {session.mentorName}</p>

        {/* Review Form */}
        {!hasReviewed ? (
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
        ) : (
          <p style={{ marginTop: "1rem", color: "green", fontWeight: "600" }}>
            You have already submitted a review for this session.
          </p>
        )}

        {/* Existing Reviews */}
        <div className="reviews-list" style={{ marginTop: "2rem" }}>
          <h3>Reviews for this session</h3>
          {reviews.length === 0 && <p>No reviews yet. Be the first to leave one!</p>}
          {reviews.map(review => (
            <div key={review.id} className="review-item">
              <div className="review-header">
                <span className="review-author">{review.learnerName}</span>
                <span className="review-rating">{review.rating} ★</span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ====================== Helpers ======================
const getDynamicStatus = (session) => {
  const { status, sessionTime } = session;
  if (!sessionTime || !sessionTime.toDate) {
    return status;
  }
  const sessionDate = sessionTime.toDate();
  const now = new Date();

  if (status === "Upcoming" && now > sessionDate) {
    return "Completed";
  }
  if (status === "Pending" && now > sessionDate) {
    return "Expired"; 
  }
  return status;
};

// Countdown formatter (HH:MM:SS, MM:SS, or SS)
const formatCountdown = (ms) => {
  if (ms <= 0) return null;

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];

  if (hours > 0) {
    parts.push(`${hours} hr${hours > 1 ? 's' : ''}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} min`);
  }
  // Always show seconds if it's the only unit, or if it's not zero
  if (seconds > 0 || parts.length === 0) {
     parts.push(`${seconds} sec`);
  }

  return parts.join(' ');
};
// ====================== Main Component ======================
export default function Sessions() {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [reviewingSession, setReviewingSession] = useState(null);
  const [loadingLink, setLoadingLink] = useState(null);
  const [now, setNow] = useState(new Date()); // 👈 for countdowns

  // update clock every second
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);

    const learnerQuery = query(collection(db, "sessions"), where("learnerId", "==", currentUser.uid));
    const mentorQuery = query(collection(db, "sessions"), where("mentorId", "==", currentUser.uid));

    const processSnapshot = (snapshot, userRole) => {
      const fetchedSessions = snapshot.docs.map(docSnapshot => {
        const data = docSnapshot.data();
        const originalStatus = data.status;
        const dynamicStatus = getDynamicStatus(data);

        if (dynamicStatus !== originalStatus) {
          updateDoc(doc(db, "sessions", docSnapshot.id), { status: dynamicStatus });
        }
        
        return { id: docSnapshot.id, ...data, status: dynamicStatus, userRole };
      });

      setSessions(prevSessions => {
        const newSessionsMap = new Map(fetchedSessions.map(s => [s.id, s]));
        const otherSessions = prevSessions.filter(s => !newSessionsMap.has(s.id));
        return [...otherSessions, ...fetchedSessions];
      });
      setLoading(false);
    };

    const unsubscribeLearner = onSnapshot(learnerQuery, (snapshot) => processSnapshot(snapshot, "Learner"));
    const unsubscribeMentor = onSnapshot(mentorQuery, (snapshot) => processSnapshot(snapshot, "Mentor"));

    return () => {
      unsubscribeLearner();
      unsubscribeMentor();
    };
  }, [currentUser]);

  const handleAccept = async (sessionId) => {
    await updateDoc(doc(db, "sessions", sessionId), { status: "Upcoming" });
  };

  const handleDecline = async (sessionId) => {
    if (window.confirm("Are you sure you want to decline this session request?")) {
      await deleteDoc(doc(db, "sessions", sessionId));
    }
  };

  const handleCreateMeetingLink = async (sessionId) => {
    setLoadingLink(sessionId);
    try {
      if (!currentUser) {
        throw new Error("You must be logged in.");
      }
      const idToken = await currentUser.getIdToken();
      const functionUrl = "https://us-central1-skillswap-4fc40.cloudfunctions.net/generateMeetingLink";
      const response = await fetch(functionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ data: { sessionId } })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.data.error || `HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.data?.success) {
        alert("Meeting link created successfully!");
      } else {
        throw new Error(result.data?.error || "Failed to create meeting link.");
      }
    } catch (error) {
      console.error("Error creating meeting link:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoadingLink(null);
    }
  };

  const filteredSessions = sessions.filter(session => session.status === activeTab);

  const formatDate = (dateObject) => {
    if (!dateObject || !dateObject.toDate) return "Date TBD";
    return dateObject.toDate().toLocaleString("en-US", {
      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
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
            {["Upcoming","Pending","Completed","Expired"].map(tab => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="sessions-list">
            {loading ? (
              <div className="loading-state">Loading sessions...</div>
            ) : filteredSessions.length > 0 ? (
              filteredSessions.map((session) => {
                const start = session.sessionTime?.toDate();
                const end = start ? new Date(start.getTime() + (session.durationMinutes || 60) * 60000) : null;
                const joinWindowStart = start ? new Date(start.getTime() - 60 * 60000) : null;                const canJoin = session.meetingLink && start && now >= joinWindowStart && now <= end;
                const countdownMs = start ? start.getTime() - now.getTime() : null;

                return (
                  <div key={session.id} className="session-item">
                    <div className="session-details">
                      <h3 className="session-skill">{session.skillName}</h3>
                      <p className="session-participant">
                        {session.userRole === "Mentor" ? "Mentoring" : "Learning from"}{" "}
                        <strong>{session.userRole === "Mentor" ? session.learnerName : session.mentorName}</strong>
                      </p>
                    </div>
                    <div className="session-meta">
                      <span className="session-date">{formatDate(session.sessionTime)}</span>
                      <span className="session-format">{session.format || "Online"}</span>
                    </div>
                    <div className="session-status">
                      <span className={`status-badge ${session.status.toLowerCase()}`}>{session.status}</span>
                    </div>

                    {/* Action buttons */}
                    <div className="session-actions">
                      {session.status === "Pending" && session.userRole === "Mentor" && (
                        <>
                          <button className="btn-secondary" onClick={() => handleDecline(session.id)}>Decline</button>
                          <button className="btn-primary" onClick={() => handleAccept(session.id)}>Accept</button>
                        </>
                      )}

                      {session.status === "Upcoming" && session.userRole === "Mentor" && !session.meetingLink && (
                        <button
                          className="btn-primary"
                          disabled={loadingLink === session.id}
                          onClick={() => handleCreateMeetingLink(session.id)}
                        >
                          {loadingLink === session.id ? "Creating..." : "Create Meeting Link"}
                        </button>
                      )}

                      {session.status === "Upcoming" && session.meetingLink && (
                        <>
                          {canJoin ? (
                            <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="btn-primary">
                              Join Session
                            </a>
                          ) : (
                            <button className="btn-disabled" disabled>
                              {countdownMs > 0 ? `Join available in ${formatCountdown(countdownMs)}` : "Link expired"}
                            </button>
                          )}
                        </>
                      )}

                      {session.status === "Completed" && session.userRole === "Learner" && (
                        <button className="btn-primary" onClick={() => setReviewingSession(session)}>
                          Leave a Review
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
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
