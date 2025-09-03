import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import SkillsPage from "./pages/SkillListings";
import Sessions from "./pages/Sessions";
import Messages from "./pages/Messages";
import BookingPage from "./pages/Booking"; 
import OfferSkillPage from "./pages/OfferSkillpage";
import ProtectedRoute from "./components/Protected"; // Import the ProtectedRoute

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes that anyone can access */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<LoginPage />} />
        
        {/* Protected routes that only logged-in users can access */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/skills" element={<ProtectedRoute><SkillsPage /></ProtectedRoute>} />
        <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/offer-skill" element={<ProtectedRoute><OfferSkillPage /></ProtectedRoute>} />
         <Route path="/book/:skillId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/offer-skill/edit/:skillId" element={<ProtectedRoute><OfferSkillPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
