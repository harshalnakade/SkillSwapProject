// src/pages/LoginPage.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AtSign, Lock, User } from "lucide-react"; // Icons for input fields
import "../styles/LoginPage.css"; // We'll create this new CSS file

// Mock SVGs for social logos
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.94 11.04c0-1.23-.1-2.45-.28-3.64H12v6.86h5.02c-.22 1.44-.88 2.68-1.88 3.52v2.92h3.74c2.18-2 3.42-4.94 3.42-8.66z"/><path d="M12 21c3.1 0 5.68-1.04 7.58-2.8l-3.74-2.92c-1.03.7-2.36 1.1-3.84 1.1-2.92 0-5.4-1.96-6.28-4.6H2.1v3.02C3.92 18.22 7.66 21 12 21z"/><path d="M5.72 12.04c-.1-.3-.15-.62-.15-.96s.05-.66.15-.96V7.1H2.1C1.44 8.34 1 9.9 1 12s.44 3.66 1.1 4.9l3.62-3.02z"/><path d="M12 5.4c1.68 0 3.2.58 4.4 1.74l3.32-3.32C17.68 2.06 15.1 1 12 1 7.66 1 3.92 3.78 2.1 7.1l3.62 3.02c.88-2.64 3.36-4.6 6.28-4.6z"/></svg>
);
const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87c0-.98-.5-1.9-1.35-2.46a3.87 3.87 0 0 0-5.3 0c-.85.56-1.35 1.48-1.35 2.46V22m7-12a4.2 4.2 0 0 0-4.14-4.14A4.2 4.2 0 0 0 9 10c0 2.28 1.86 4.14 4.14 4.14A4.2 4.2 0 0 0 16 10z"/></svg>
);


export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", formData);
    // Simulate API call and navigate on success
    navigate("/dashboard");
  };

  return (
    <div className="auth-page-container">
      {/* === Left Panel: Branding === */}
      <div className="auth-branding-panel">
        <div className="branding-content">
          <Link to="/" className="branding-logo">SkillSwap</Link>
          <h1 className="branding-title">Unlock Your Potential.</h1>
          <p className="branding-subtitle">Join a vibrant community dedicated to lifelong learning and growth.</p>
        </div>
      </div>

      {/* === Right Panel: Form === */}
      <main className="auth-form-panel">
        <div className="form-container">
          <div className="form-header">
            <h2>{isLogin ? "Welcome Back!" : "Create an Account"}</h2>
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button onClick={() => setIsLogin(!isLogin)} className="toggle-auth-btn">
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group">
                <User className="input-icon" />
                <input
                  type="text" name="name" placeholder="Full Name" required
                  value={formData.name} onChange={handleChange}
                />
              </div>
            )}
            <div className="input-group">
              <AtSign className="input-icon" />
              <input
                type="email" name="email" placeholder="Email Address" required
                value={formData.email} onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <Lock className="input-icon" />
              <input
                type="password" name="password" placeholder="Password" required
                value={formData.password} onChange={handleChange}
              />
            </div>
            
            {isLogin && (
                <div className="form-options">
                    <label className="custom-checkbox">
                        <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange}/>
                        Remember me
                    </label>
                    <a href="#" className="forgot-password-link">Forgot password?</a>
                </div>
            )}

            <button type="submit" className="submit-btn">
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          <div className="social-login-divider">
            <span>OR</span>
          </div>
          
          <div className="social-login-buttons">
            <button className="social-btn google-btn">
              <GoogleIcon /> Continue with Google
            </button>
            <button className="social-btn github-btn">
              <GithubIcon /> Continue with GitHub
            </button>
          </div>

          {!isLogin && (
            <p className="terms-text">
              By creating an account, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}