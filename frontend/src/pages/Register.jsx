import React, { useState, useEffect } from "react";
import "../styles/Register.css";
import DanceLahLogo from "../assets/DanceLahLogoHigh.png";
import eyeIcon from "../assets/eyeIcon.png";
import eyeIconCrossed from "../assets/eyeIconCrossed.png";
import axios from "axios";
import ReCAPTCHA from 'react-google-recaptcha';

const Register = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("artist"); // Default to artist
    const [dob, setDob] = useState("");
    const [guardian_name, setGuardian_Name] = useState("");
    const [coach_name, setCoach_name] = useState(""); // Coach selection if artist is selected
    const [error, setError] = useState("");
    const [captchaValue, setCaptchaValue] = useState(null);

    const calculateAge = (dob) => {
      const birthDate = new Date(dob);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
          return age - 1;
      }
      return age;
    };

    useEffect(() => {
      // Check if the age is below 12
      if (dob) {
          const age = calculateAge(dob);
          if (age < 7 || age > 70) {
              setError("Age must be between 7 and 70.");
          } else {
              setError("");
          }
      }
    }, [dob]);

    const handleRegister = async (e) => {
      e.preventDefault();

      // Check if passwords match
      if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
      }

      if (!captchaValue) {
        alert("Please verify the captcha");
        return;
      }


      try {
          const response = await axios.post("http://localhost:8000/api/register/", {
              full_name: fullName,
              email,
              password,
              confirmPassword,
              role,
              dob,
              guardian_name,
              coach_name,
              recaptcha: captchaValue,  // Send reCAPTCHA token to backend
          });
          console.log("User created successfully", response.data);
          window.location.href = "/login"; // Redirect to login after successful registration
      } catch (err) {
          setError("An error occurred. Please try again.");
          console.error("Registration failed:", err);
      }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <img src={DanceLahLogo} alt="Dance Lah Logo" className="register-logo" />
      </div>

      <div className="register-right">
        <h2 className="register-title">Create an account</h2>

        <form className="register-form" onSubmit={handleRegister} autoComplete="off">
          <label>Full Name*</label>
          <input 
            type="text" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="" 
            required 
          />

          <label>Email*</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="eg: myname@gmail.com" 
            required 
            autoComplete="new-password"
          />

          <label>Password*</label>
          <div className="password-field-register">
            <input 
              type={showPassword ? "text" : "password"} 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <img
              src={showPassword ? eyeIconCrossed : eyeIcon}
              alt="toggle visibility"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <label>Confirm Password*</label>
          <div className="password-field-register">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <img
              src={showConfirmPassword ? eyeIconCrossed : eyeIcon}
              alt="toggle visibility"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>

          <label>Select User Type*</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="" disabled selected>
              Please Select
            </option>
            <option value="artist">Artist</option>
            <option value="coach">Coach</option>
            <option value="director">Director</option>
          </select>

          {role === "artist" && (
            <div>
                <label>Select Coach*</label>
                <select value={coach_name} onChange={(e) => setCoach_name(e.target.value)} required>
                    <option value="" disabled selected>
                        Please Select Coach
                    </option>
                    <option value="coach1">Coach Eugene Lee</option>
                    <option value="coach2">Coach Edwin Tan</option>
                    <option value="coach3">Coach Lim Wei Lin</option>
                </select>
            </div>
          )}

          <label>Date of Birth*</label>
          <input 
            type="date" 
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required 
          />

          {/* Show Guardian Name only if the user type is Artist and age is below 12 */}
          {role === "artist" && calculateAge(dob) < 12 && (
            <div>
                <label>Guardian Name*</label>
                <input
                    type="text"
                    value={guardian_name}
                    onChange={(e) => setGuardian_Name(e.target.value)}
                    required
                />
            </div>
          )}

          <div className="register-checkbox">
            <input type="checkbox" required />
            <span>
              By creating an account, I agree to the <a href="/TermsCondition">Terms of Use</a> and{" "}
              <a href="/PrivacyPolicy">Privacy Policy</a>.
            </span>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* Google reCAPTCHA */}
          <ReCAPTCHA
                sitekey="6Lfz494qAAAAAPtrCHx6Bp8D3Hnc4IyK3RKorCcr" // Replace with actual site key
                onChange={(value) => setCaptchaValue(value)}
          />

          <button type="submit" className="register-btn">
            Create an account
          </button>

          <p className="register-login">
            Have an account? <a href="/login">Log In</a> instead
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
