import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import DanceLahLogoHigh from "../assets/DanceLahLogoHigh.png";
import eyeIcon from "../assets/eyeIcon.png";
import eyeIconCrossed from "../assets/eyeIconCrossed.png";
import axios from "axios";
import ReCAPTCHA from 'react-google-recaptcha';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const [captchaValue, setCaptchaValue] = useState(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000); // Clear error message after 5 seconds
      return () => clearTimeout(timer); // Clear timeout if component unmounts
    }
  }, [error]);

  // Regex pattern to validate email
  const validateEmail = (email) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!captchaValue) {
      alert('Please complete the reCAPTCHA');
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    try {
        const response = await axios.post("http://localhost:8000/api/user/login/", {
            email,
            password,
            recaptcha: captchaValue,  // Send reCAPTCHA token to backend
        });
        localStorage.setItem("access", response.data.access);
        localStorage.setItem("refresh", response.data.refresh);
        localStorage.setItem("role", response.data.role);

        // Redirect based on role
        if (response.data.role === "artist") {
          window.location.href = "/HomeArtist";
        } else if (response.data.role === "coach") {
            window.location.href = "/HomeCoach";
        } else if (response.data.role === "director") {
            window.location.href = "/HomeDirector";
        } else {
            window.location.href = "/"; // Default fallback
        }

    } catch (err) {
      setError(err.response.data.error || "Invalid credentials. Please try again.");
        console.error("Login failed:", err);
    }
  };

  return (
    <div className="login-container">
      {/* Left Section with Logo */}
      <div className="login-left">
        <img src={DanceLahLogoHigh} alt="Dance Lah Logo" className="login-logo" />
      </div>

      {/* Right Section with Box Wrapper */}
      <div className="login-right">
        <div className="login-box">
          <h2 className="login-title">Log In</h2>
          {error && <p className="error-message">{error}</p>}

          <form className="login-form" onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <div className="password-field-login">
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <img
                src={showPassword ? eyeIcon : eyeIconCrossed}
                alt="Toggle Visibility"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            <div className="login-links">
              <a href="/resetpassword" className="forgot-password">Forgot your password</a>
              <span className="plain-text">
                No account? <a href="/register" className="signup-link">Sign Up</a>
            </span>
            </div>

            <ReCAPTCHA sitekey="6Lfz494qAAAAAPtrCHx6Bp8D3Hnc4IyK3RKorCcr" onChange={(value) => setCaptchaValue(value)} />

            <button type="submit" className="login-btn">Log In</button>

            <p className="terms-text">
              By continuing, you agree to the <a href="/TermsCondition">Terms of Use</a> and <a href="/PrivacyPolicy">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;