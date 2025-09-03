import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, addDoc, collection, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import "../styles/Booking.css";

// Helper function to generate the next 7 bookable days and check for conflicts
const generateNext7Days = (availability, bookedSlots) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const schedule = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dayOfWeek = days[date.getDay()];
        const allPossibleSlots = availability[dayOfWeek];

        if (allPossibleSlots && allPossibleSlots.length > 0) {
            // Filter out any slots that are already booked for this specific date
            const availableSlots = allPossibleSlots.filter(slot => {
                const sessionDate = new Date(date);
                const [time, period] = slot.split(' ');
                let [hours, minutes] = time.split(':');
                hours = parseInt(hours);
                if (period === 'PM' && hours < 12) hours += 12;
                if (period === 'AM' && hours === 12) hours = 0;
                sessionDate.setHours(hours, parseInt(minutes), 0, 0);
                const sessionDateStr = sessionDate.toLocaleString();
                return !bookedSlots.some(booked => booked.toLocaleString() === sessionDateStr);
            });
            
            schedule.push({
                date: date,
                day: dayOfWeek,
                slots: availableSlots, // Only the ones that are free
                allSlots: allPossibleSlots // Keep the original list for UI rendering
            });
        }
    }
    return schedule;
};

export default function BookingPage() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchSkillAndSchedule = async () => {
      // THE FIX: Use a try...catch...finally block for robust error handling
      try {
        const docRef = doc(db, "skills", skillId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const skillData = { id: docSnap.id, ...docSnap.data() };
          setSkill(skillData);

          const sessionsQuery = query(
              collection(db, "sessions"),
              where("mentorId", "==", skillData.teacherId),
              where("status", "in", ["Pending", "Upcoming"])
          );
          const querySnapshot = await getDocs(sessionsQuery);
          const bookedSlots = querySnapshot.docs.map(doc => doc.data().sessionTime.toDate());
          
          if (skillData.availability) {
              setSchedule(generateNext7Days(skillData.availability, bookedSlots));
          }
        } else {
          console.error("No such skill found!");
          setSkill(null); // Explicitly set skill to null if not found
        }
      } catch (error) {
        console.error("Error fetching skill data:", error);
      } finally {
        // This will run regardless of success or failure, fixing the infinite load
        setLoading(false);
      }
    };

    fetchSkillAndSchedule();
  }, [skillId]);

  const handleSlotSelect = (date, slot) => {
    setSelectedSlot({ date, slot });
  };

  const handleConfirmBooking = async () => {
    // This function's logic remains the same
    if (!selectedSlot || !currentUser || !skill) {
      alert("Please select a time slot.");
      return;
    }
    if (currentUser.uid === skill.teacherId) {
        alert("You cannot book a session with yourself.");
        return;
    }

    setIsBooking(true);
    try {
        const [time, period] = selectedSlot.slot.split(' ');
        let [hours, minutes] = time.split(':');
        hours = parseInt(hours);
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        const sessionDate = new Date(selectedSlot.date);
        sessionDate.setHours(hours, parseInt(minutes), 0, 0);

      await addDoc(collection(db, "sessions"), {
        skillId: skill.id,
        skillName: skill.skillName,
        mentorId: skill.teacherId,
        mentorName: skill.teacherName,
        learnerId: currentUser.uid,
        learnerName: currentUser.name || currentUser.displayName,
        sessionTime: sessionDate,
        status: "Pending",
        createdAt: serverTimestamp(),
      });
      alert("Session requested successfully! The mentor has been notified.");
      navigate("/sessions");
    } catch (error) {
      console.error("Error booking session: ", error);
      alert("Failed to book session. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
        <div className="booking-page-container">
            <Sidebar />
            <main className="booking-main-content main-content-area">
                <div className="loading-state">Loading booking information...</div>
            </main>
        </div>
    );
  }

  if (!skill) {
    return (
        <div className="booking-page-container">
            <Sidebar />
            <main className="booking-main-content main-content-area">
                <h2>Skill not found.</h2>
                <Link to="/skills" className="btn-primary">Back to Explore</Link>
            </main>
        </div>
    );
  }

  return (
    <div className="booking-page-container">
      <Sidebar />
      <main className="booking-main-content main-content-area">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={20} /> Back to skills
        </button>
        
        <div className="booking-grid">
          <div className="skill-details-panel">
            <img src={skill.teacherAvatar} alt={skill.teacherName} className="mentor-avatar" />
            <h1>{skill.skillName}</h1>
            <p className="mentor-name">with <strong>{skill.teacherName}</strong></p>
            <p className="skill-description">{skill.description}</p>
            <div className="details-tags">
                <span className="tag">{skill.category}</span>
                <span className="tag">{skill.level}</span>
            </div>
          </div>

          <div className="availability-panel">
            <h2><Calendar size={24} /> Select a Date & Time</h2>
            <div className="availability-grid">
              {schedule.length > 0 ? schedule.map(({ date, day, slots, allSlots }) => (
                  <div key={date.toISOString()} className="availability-day">
                    <h5>
                        {day}
                        <span>{date.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}</span>
                    </h5>
                    <div className="slots-container">
                      {allSlots.map(slot => {
                        const isBooked = !slots.includes(slot);
                        return (
                            <button
                                key={slot}
                                className={`slot-btn ${selectedSlot?.date.toISOString() === date.toISOString() && selectedSlot?.slot === slot ? 'selected' : ''} ${isBooked ? 'disabled' : ''}`}
                                onClick={() => handleSlotSelect(date, slot)}
                                disabled={isBooked}
                            >
                                {isBooked ? 'Booked' : slot}
                            </button>
                        );
                      })}
                    </div>
                  </div>
              )) : <p className="no-availability-msg">This mentor has not set their availability yet.</p>}
            </div>
            <div className="booking-footer">
                <button 
                    className="btn-confirm-booking" 
                    onClick={handleConfirmBooking}
                    disabled={!selectedSlot || isBooking}
                >
                    {isBooking ? <div className="spinner-light"></div> : 
                    selectedSlot ? `Confirm for ${selectedSlot.date.toLocaleDateString("en-US", {weekday: 'short', month: 'short', day: 'numeric'})}, ${selectedSlot.slot}` : 'Select a Slot'}
                </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

