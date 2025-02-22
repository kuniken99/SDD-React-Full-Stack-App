import React, { useState, useEffect } from "react";
import "../../styles/Artist/ArtistProfile.css";
import api from "../../api"; // API handler

function ArtistProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [updatedValue, setUpdatedValue] = useState("");

  // Function to fetch artist profile
  async function fetchProfile() {
    try {
      const response = await api.get("/api/artist-info/");
      setProfile(response.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }

  // Fetch profile when component mounts
  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle field edit
  const handleChangeClick = (field) => {
    setEditingField(field);
    setUpdatedValue(profile[field]);
  };

  // Handle field value update
  const handleInputChange = (e) => {
    setUpdatedValue(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingField === "full_name") {
        // Handle updating full name (API request or state update)
        await api.put("/api/update-full-name/", { full_name: updatedValue });
      } else if (editingField === "email") {
        // Handle updating email (API request or state update)
        await api.put("/api/update-email/", { email: updatedValue });
      } else if (editingField === "password") {
        // Handle updating password (API request or state update)
        await api.put("/api/update-password/", { password: updatedValue });
      }

      // Update profile state
      setProfile((prevProfile) => ({
        ...prevProfile,
        [editingField]: updatedValue,
      }));

      // Close modal after successful update
      setEditingField(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile.");
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="profile-container">
      <h1>Artist Profile</h1>
      <div className="profile-card">
        <div className="profile-field">
          <label>Full Name</label>
          <input type="text" value={profile.full_name} readOnly />
          <button className="change-btn" onClick={() => handleChangeClick("full_name")}>Change</button>
        </div>

        <div className="profile-field">
          <label>Email</label>
          <input type="email" value={profile.email} readOnly />
          <button className="change-btn" onClick={() => handleChangeClick("email")}>Change</button>
        </div>

        <div className="profile-field">
          <label>Password</label>
          <input type="password" value="********" readOnly />
          <button className="change-btn" onClick={() => handleChangeClick("password")}>Change</button>
        </div>

        <div className="profile-field">
          <label>User Type</label>
          <input type="text" value={profile.role} readOnly />
        </div>

        <div className="profile-field">
          <label>Date of Birth</label>
          <input type="text" value={profile.dob} readOnly />
        </div>

        <div className="profile-field">
          <label>Guardian Name</label>
          <input type="text" value={profile.guardian_name} readOnly />
        </div>

        <p className="support-message">
          PS: To change date of birth and guardian name, please contact us at{" "}
          <a href="mailto:support@dancelah.com">support@dancelah.com</a>
        </p>
      </div>

      {/* Modal for editing */}
      {editingField && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit {editingField.charAt(0).toUpperCase() + editingField.slice(1)}</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                type={editingField === "password" ? "password" : "text"}
                value={updatedValue}
                onChange={handleInputChange}
                required
              />
              <div className="modal-buttons">
                <button type="submit" className="change-btn">Save</button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditingField(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtistProfile;
