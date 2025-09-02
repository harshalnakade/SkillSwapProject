import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AtSign, Lock, User, GraduationCap, Lightbulb, Eye, EyeOff } from "lucide-react";

// Import Firebase services and functions
import { auth, db, googleProvider } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

import "../styles/LoginPage.css";

// Mock SVGs for social logos
const GoogleIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.94 11.04c0-1.23-.1-2.45-.28-3.64H12v6.86h5.02c-.22 1.44-.88 2.68-1.88 3.52v2.92h3.74c2.18-2 3.42-4.94 3.42-8.66z"/><path d="M12 21c3.1 0 5.68-1.04 7.58-2.8l-3.74-2.92c-1.03.7-2.36 1.1-3.84 1.1-2.92 0-5.4-1.96-6.28-4.6H2.1v3.02C3.92 18.22 7.66 21 12 21z"/><path d="M5.72 12.04c-.1-.3-.15-.62-.15-.96s.05-.66.15-.96V7.1H2.1C1.44 8.34 1 9.9 1 12s.44 3.66 1.1 4.9l3.62-3.02z"/><path d="M12 5.4c1.68 0 3.2.58 4.4 1.74l3.32-3.32C17.68 2.06 15.1 1 12 1 7.66 1 3.92 3.78 2.1 7.1l3.62 3.02c.88-2.64 3.36-4.6 6.28-4.6z"/></svg> );
const GithubIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87c0-.98-.5-1.9-1.35-2.46a3.87 3.87 0 0 0-5.3 0c-.85.56-1.35 1.48-1.35 2.46V22m7-12a4.2 4.2 0 0 0-4.14-4.14A4.2 4.2 0 0 0 9 10c0 2.28 1.86 4.14 4.14 4.14A4.2 4.2 0 0 0 16 10z"/></svg> );


export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    rememberMe: false, roles: ['learner'],
  });
  
  const validateField = (name, value) => {
    let error = "";
    if (!isLogin && name === "name" && !value) error = "Full Name is required.";
    if (name === "email") {
        if (!value) error = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Email address is invalid.";
    }
    if (name === "password") {
        if (!value) error = "Password is required.";
        else if (!isLogin && value.length < 8) error = "Password must be at least 8 characters.";
    }
    if (!isLogin && name === "confirmPassword" && value !== formData.password) {
        error = "Passwords do not match.";
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setFormData(prev => ({ ...prev, [name]: fieldValue }));
    validateField(name, fieldValue);
  };
  
  const handleRoleChange = (role) => {
    setFormData(prev => {
        const newRoles = prev.roles.includes(role)
            ? prev.roles.filter(r => r !== role)
            : [...prev.roles, role];
        return { ...prev, roles: newRoles.length > 0 ? newRoles : ['learner'] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Step 1: Perform a final, comprehensive validation check
    const formErrors = {};
    if (!isLogin) {
      if (!formData.name.trim()) formErrors.name = "Full Name is required.";
      if (formData.password !== formData.confirmPassword) formErrors.confirmPassword = "Passwords do not match.";
      if (formData.roles.length === 0) {
        alert("Please select at least one role.");
        return; // Stop submission if no role is selected
      }
    }
    if (!formData.email.trim()) {
        formErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        formErrors.email = "Email address is invalid.";
    }
    if (!formData.password) {
        formErrors.password = "Password is required.";
    } else if (!isLogin && formData.password.length < 8) {
        formErrors.password = "Password must be at least 8 characters.";
    }
    
    setErrors(formErrors);

    // Step 2: Check if there are any errors. If so, stop the submission.
    if (Object.keys(formErrors).length > 0) {
      return; 
    }

    // Step 3: Only if validation passes, start the loading spinner.
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        navigate("/dashboard");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: formData.name,
          email: formData.email,
          roles: formData.roles,
          memberSince: new Date(),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name)}`
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setErrors({ form: error.message.replace('Firebase: ', '') });
    } finally {
      setIsLoading(false); // This will run after success OR failure
    }
  };

  const handleGoogleSignIn = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
            await setDoc(userDocRef, {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                roles: ['learner'],
                memberSince: new Date(),
                avatar: user.photoURL,
            });
        }
        navigate("/dashboard");
    } catch (error) {
        console.error("Google Sign-In Error:", error);
        setErrors({ form: error.message.replace('Firebase: ', '') });
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-branding-panel">
        <div className="branding-content">
          <Link to="/" className="branding-logo">SkillSwap</Link>
          <h1 className="branding-title">Unlock Your Potential.</h1>
          <p className="branding-subtitle">Join a vibrant community dedicated to lifelong learning and growth.</p>
        </div>
      </div>
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
          
          {errors.form && <p className="error-message form-error">{errors.form}</p>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group">
                <User className="input-icon" />
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
                {errors.name && <p className="error-message">{errors.name}</p>}
              </div>
            )}
            <div className="input-group">
              <AtSign className="input-icon" />
              <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>
            <div className="input-group">
              <Lock className="input-icon" />
              <input type={passwordVisible ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
              <button type="button" className="password-toggle-btn" onClick={() => setPasswordVisible(!passwordVisible)}>
                {passwordVisible ? <EyeOff size={20}/> : <Eye size={20}/>}
              </button>
              {errors.password && <p className="error-message">{errors.password}</p>}
            </div>
            {!isLogin && (
              <div className="input-group">
                  <Lock className="input-icon" />
                  <input type={passwordVisible ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
                  {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
              </div>
            )}
            {!isLogin && (
              <div className="role-selection-group">
                  <label className="input-label">I am here to...</label>
                  <div className="role-options-container">
                      <div className={`role-option-card ${formData.roles.includes('learner') ? 'selected' : ''}`} onClick={() => handleRoleChange('learner')}>
                          <GraduationCap className="role-icon" /> <span>Learn</span>
                      </div>
                      <div className={`role-option-card ${formData.roles.includes('teacher') ? 'selected' : ''}`} onClick={() => handleRoleChange('teacher')}>
                          <Lightbulb className="role-icon" /> <span>Teach</span>
                      </div>
                  </div>
              </div>
            )}
            {isLogin && (
              <div className="form-options">
                  <label className="custom-checkbox">
                      <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange}/> Remember me
                  </label>
                  <a href="#" className="forgot-password-link">Forgot password?</a>
              </div>
            )}
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? <div className="spinner"></div> : (isLogin ? "Login" : "Create Account")}
            </button>
          </form>

          <div className="social-login-divider"><span>OR</span></div>
          
          <div className="social-login-buttons">
            <button type="button" className="social-btn google-btn" onClick={handleGoogleSignIn}><GoogleIcon /> Continue with Google</button>
            <button type="button" className="social-btn github-btn"><GithubIcon /> Continue with GitHub</button>
          </div>

          {!isLogin && (
            <p className="terms-text">
              By creating an account, you agree to our <a href="#">Terms of Service</a>.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
