import React, { useState, useEffect } from "react";
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

  const handleSendOtp = () => {
    setOtpMessage("OTP has been sent successfully!");
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
  };

  return (
    <div className="reset-container">
      {/* Left Section with Logo */}
      <div className="reset-left">
        <img src={DanceLahLogoHigh} alt="Dance Lah Logo" className="reset-logo" />
      </div>

      {/* Right Section with Form */}
      <div className="reset-right">
        <h2 className="reset-title">Reset Password</h2>
        <form className="reset-form">
          <label>Email</label>
          <input type="email" required />

          <div className="otp-container">
            <div className="otp-field">
              <label>OTP</label>
              <input type="text" required />
            </div>
            <button
              type="button"
             className="send-otp-btn" 
             onClick={handleSendOtp}
              disabled={otpDisabled}>
              {otpDisabled ? `Resend OTP in ${countdown}s` : "Send OTP"}
            </button>
          </div>

          {/* OTP Sent Message */}
          {otpMessage && <div className="otp-message">{otpMessage}</div>}


          <label>New Password</label>
          <div className="password-field">
            <input type={showNewPassword ? "text" : "password"} required />
            <img
              src={showNewPassword ? eyeIcon : eyeIconCrossed}
              alt="Toggle Visibility"
              onClick={() => setShowNewPassword(!showNewPassword)}
            />
          </div>

          <label>Confirm New Password</label>
          <div className="password-field">
            <input type={showConfirmPassword ? "text" : "password"} required />
            <img
              src={showConfirmPassword ? eyeIcon : eyeIconCrossed}
              alt="Toggle Visibility"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>

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
