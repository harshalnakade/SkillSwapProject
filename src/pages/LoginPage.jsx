import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    agreeToTerms: false
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // simulate login/signup
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Welcome to SkillSwap</h2>
        <p className="auth-subtitle">Join our community of learners and teachers</p>

        <div className="auth-toggle">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={e => handleChange("name", e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={e => handleChange("email", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder={isLogin ? "Enter your password" : "Create a password"}
              value={formData.password}
              onChange={e => handleChange("password", e.target.value)}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={e => handleChange("confirmPassword", e.target.value)}
              />
            </div>
          )}

          {isLogin ? (
            <div className="form-footer">
              <label>
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={e => handleChange("rememberMe", e.target.checked)}
                /> Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>
          ) : (
            <div className="form-footer">
              <label>
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={e => handleChange("agreeToTerms", e.target.checked)}
                /> I agree to Terms & Privacy
              </label>
            </div>
          )}

          <button type="submit" className="submit-btn">
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        <div className="social-login">
          <p>Or continue with</p>
          <div className="social-buttons">
            <button className="google-btn">G Google</button>
            <button className="github-btn">GitHub</button>
          </div>
        </div>
      </div>
    </div>
  );
}
