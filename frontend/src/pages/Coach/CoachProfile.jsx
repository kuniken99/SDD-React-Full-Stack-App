import React, { useState, useEffect, useRef } from "react";
import "../../styles/Coach/CoachProfile.css";
import api from "../../api";
import profilePlaceholder from "../../assets/ProfilePic.png"; 
import pencilIcon from "../../assets/Pencil.png";

function CoachProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [updatedValue, setUpdatedValue] = useState("");
  const [otp, setOtp] = useState(""); // State to store OTP
  const [newPassword, setNewPassword] = useState(""); // State to store new password
  const [otpSent, setOtpSent] = useState(false); // Track if OTP is sent
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false); // Track if password is updated
  const [emailChangeSuccess, setEmailChangeSuccess] = useState(false); // Track if email change was successful
  const [selectedFile, setSelectedFile] = useState(null); // State to store selected file
  const [preview, setPreview] = useState(null); // State to store preview URL
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  async function fetchProfile() {
    try {
      const response = await api.get("/api/coach-info/");
      setProfile(response.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();

    // Close modal if clicking outside of it
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setEditingField(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  const handleChangeClick = (field) => {
    // Reset OTP and password change success when changing other fields
    if (field !== "password" && field !== "email") {
      setOtpSent(false);
      setPasswordChangeSuccess(false);
      setEmailChangeSuccess(false);
    }
    
    setEditingField(field);
    setUpdatedValue(profile ? profile[field] || "" : "");
  };

  const handleInputChange = (e) => {
    setUpdatedValue(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      uploadProfilePicture(file);
    }
  };

  const uploadProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      await api.post("/api/update-profile-picture/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Re-fetch profile data after upload
      const response = await api.get("/api/coach-info/");
      setProfile(response.data);
      setPreview(null);
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Failed to update profile picture.");
    }
  };

  // Request OTP to user's email
  const handleRequestOtp = async () => {
    try {
      await api.post("/api/request-password-change-otp/");
      setOtpSent(true);
    } catch (error) {
      console.error("Failed to send OTP:", error);
      setError("Failed to send OTP. Please try again.");
    }
  };

  // Request OTP to user's email
  const handleRequestOtpEmail = async () => {
    try {
      await api.post("/api/request-email-change-otp/");
      setOtpSent(true);
    } catch (error) {
      console.error("Failed to send OTP:", error);
      setError("Failed to send OTP. Please try again.");
    }
  };

  // Submit OTP and new password to the backend for verification and update
  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    try {
      await api.put("/api/verify-otp-and-change-password/", {
        otp,
        password: newPassword,
      });
      setPasswordChangeSuccess(true);
      setEditingField(null);
    } catch (error) {
      console.error("Failed to change password:", error);
      setError("Failed to update password. Please check the OTP.");
    }
  };

  // Submit OTP and new email to the backend for verification and update
  const handleSubmitEmailChange = async (e) => {
    e.preventDefault();
    try {
      await api.put("/api/verify-otp-and-change-email/", {
        otp,
        email: updatedValue,
      });
      setEmailChangeSuccess(true);
      setEditingField(null);
    } catch (error) {
      console.error("Failed to change email:", error);
      setError("Failed to update email. Please check the OTP.");
    }
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateEndpoint = {
        full_name: "/api/update-full-name/",
        email: "/api/update-email/",
        password: "/api/update-password/",
      };
      await api.put(updateEndpoint[editingField], { [editingField]: updatedValue });
      setProfile((prevProfile) => ({ ...prevProfile, [editingField]: updatedValue }));
      setEditingField(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile.");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="coach-profile">
      <h1>Profile</h1>
    
    {/* Profile Pic */}
    <div className="coach-profile-container">
      <div className="profile-left">
        <div className="profile-pic-wrapper" onClick={handleProfilePicClick}>
          <img src={preview || (profile.profile_picture && `${api.defaults.baseURL}${profile.profile_picture}`) || profilePlaceholder} alt="Profile" className="profile-pic" />
          <img src={pencilIcon} alt="Edit" className="edit-icon" />
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          accept="image/*" 
          style={{ display: "none" }} 
          onChange={handleFileChange} 
        />
        <h2 className="coach-name">{profile.full_name}</h2>
        <p className="user-type">Coach</p>
      </div>

      {/* Profile Details */}
      <div className="profile-right">
        <div className="profile-field">
          <label>Full Name:</label>
          <input type="text" value={profile.full_name} readOnly />
          <button className="change-btn" onClick={() => handleChangeClick("full_name")}>Change</button>
        </div>

        <div className="profile-field">
          <label>Email:</label>
          <input type="email" value={profile.email} readOnly />
          <button className="change-btn" onClick={() => handleChangeClick("email")}>Change</button>
        </div>

        <div className="profile-field">
          <label>Password:</label>
          <input type="password" value="********" readOnly />
          <button className="change-btn" onClick={() => handleChangeClick("password")}>Change</button>
        </div>

        <div className="profile-field no-change-btn">
          <label>Date of Birth:</label>
          <input type="text" value={profile.dob} readOnly />
        </div>

        <p className="support-message">
          PS: To change date of birth, please contact us at {" "}
          <a href="mailto:support@dancelah.com">support@dancelah.com</a>
        </p>
      </div>

      {/* Modal for editing full name */}
      {editingField === "full_name" && (
        <div className="modal" ref={modalRef}>
          <div className="modal-content">
            <h2>Edit Full Name</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                type={editingField === "password" ? "password" : "text"}
                value={updatedValue}
                onChange={handleInputChange}
                required
                className="modal-input"
              />
              <div className="modal-buttons">
                <button type="button" className="cancel-btn" onClick={() => setEditingField(null)}>Cancel</button>
                <button type="submit" className="change-btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingField === "password" && !otpSent && (
        <div className="modal" ref={modalRef}>
          <div className="modal-content">
            <h2>Request OTP to Change Password</h2>
            <button className="change-btn" onClick={handleRequestOtp}>Request OTP</button>
          </div>
        </div>
      )}

      {editingField === "password" && otpSent && !passwordChangeSuccess && (
        <div className="modal" ref={modalRef}>
          <div className="modal-content">
            <h2>Enter OTP and New Password</h2>
            <form onSubmit={handleSubmitPasswordChange}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={handleOtpChange}
                className="modal-input"
                required
                autoComplete="off"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                className="modal-input"
                required
                autoComplete="new-password"
              />
              <div className="modal-buttons">
                <button type="button" className="cancel-btn" onClick={() => setEditingField(null)}>Cancel</button>
                <button type="submit" className="change-btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for email change with OTP */}
      {editingField === "email" && !otpSent && (
        <div className="modal" ref={modalRef}>
          <div className="modal-content">
            <h2>Request OTP to Change Email</h2>
            <button className="change-btn" onClick={handleRequestOtpEmail}>Request OTP</button>
          </div>
        </div>
      )}
      {editingField === "email" && otpSent && !emailChangeSuccess && (
        <div className="modal" ref={modalRef}>
          <div className="modal-content">
            <h2>Enter OTP and New Email</h2>
            <form onSubmit={handleSubmitEmailChange}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={handleOtpChange}
                className="modal-input"
                required
                autoComplete="off"
              />
              <input
                type="email"
                placeholder="New Email"
                value={updatedValue}
                onChange={handleInputChange}
                className="modal-input"
                required
                autoComplete="off"
              />
              <div className="modal-buttons">
                <button type="button" className="cancel-btn" onClick={() => setEditingField(null)}>Cancel</button>
                <button type="submit" className="change-btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {passwordChangeSuccess && (
        <div className="success-message">
          <p>Password updated successfully!</p>
        </div>
      )}

      {emailChangeSuccess && (
        <div className="success-message">
          <p>Email updated successfully!</p>
        </div>
      )}

    </div>
    </div>
  );
}

export default CoachProfile;