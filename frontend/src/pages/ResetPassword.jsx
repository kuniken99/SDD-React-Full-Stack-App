import React, { useState, useEffect } from "react";
import api from "../api";
import "../styles/ResetPassword.css";
import DanceLahLogoHigh from "../assets/DanceLahLogoHigh.png";
import eyeIcon from "../assets/eyeIcon.png";
import eyeIconCrossed from "../assets/eyeIconCrossed.png";

const ResetPassword = () => {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpMessage, setOtpMessage] = useState(""); // OTP sent message
  const [countdown, setCountdown] = useState(0); // Countdown state
  const [otpDisabled, setOtpDisabled] = useState(false); // Disable button state
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000); // Clear error message after 15 seconds
      return () => clearTimeout(timer); // Clear timeout if component unmounts
    }
  }, [errorMessage]);

  const handleSendOtp = async () => {
    try {
      const response = await api.post('/api/send-otp/', { email });
      setOtpMessage(response.data.message);
      setCountdown(60); // Start countdown from 60 seconds
      setOtpDisabled(true); // Disable the button

      // Start countdown effect
      let timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setOtpMessage(""); // Remove message after countdown
            setOtpDisabled(false); // Enable button after countdown
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setErrorMessage(error.response.data.detail || "Failed to send OTP.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await api.post('/api/reset-password/', { email, otp, new_password: newPassword });
      setResetSuccess(true);
      setTimeout(() => {
        window.location.href = '/login'; // Redirect to login page after 2 seconds
      }, 2000);
    } catch (error) {
      setErrorMessage(error.response.data.detail || "Failed to reset password.");
    }
  };

  if (resetSuccess) return <h1>Reset Successful! You can now Log In.</h1>;
  

  return (
    <div className="reset-container">
      {/* Left Section with Logo */}
      <div className="reset-left">
        <img src={DanceLahLogoHigh} alt="Dance Lah Logo" className="reset-logo" />
      </div>

      {/* Right Section with Form */}
      <div className="reset-right">
        <h2 className="reset-title">Reset Password</h2>
        <form className="reset-form" onSubmit={handleResetPassword}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <div className="otp-container">
            <div className="otp-field">
              <label>OTP</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            </div>
            <button
              type="button"
              className="send-otp-btn"
              onClick={handleSendOtp}
              disabled={otpDisabled}
            >
              {otpDisabled ? `Resend OTP in ${countdown}s` : "Send OTP"}
            </button>
          </div>

          {/* OTP Sent Message */}
          {otpMessage && <div className="otp-message">{otpMessage}</div>}

          <label>New Password</label>
          <div className="password-field">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <img
              src={showNewPassword ? eyeIcon : eyeIconCrossed}
              alt="Toggle Visibility"
              onClick={() => setShowNewPassword(!showNewPassword)}
            />
          </div>

          <label>Confirm New Password</label>
          <div className="password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <img
              src={showConfirmPassword ? eyeIcon : eyeIconCrossed}
              alt="Toggle Visibility"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <button type="submit" className="reset-btn">Reset Password</button>
        </form>

        <p className="reset-login">
          Don’t have an account? <a href="/register">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;