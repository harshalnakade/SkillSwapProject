import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import SkillListings from "./pages/SkillListings";
import Sessions from "./pages/Sessions";
import Messages from "./pages/Messages";
import OfferSkillPage from "./pages/OfferSkillpage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/skills" element={<SkillListings />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/offer-skill" element={<OfferSkillPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
