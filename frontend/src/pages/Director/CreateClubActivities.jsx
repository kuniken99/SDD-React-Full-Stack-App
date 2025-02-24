import React, { useState } from "react";
import api from "../../api";
import "../../styles/TableStyles.css";

const CreateClubActivities = () => {
    const [activityName, setActivityName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/club-activities/', {
                name: activityName,
                description: description,
            });
            setActivityName("");
            setDescription("");
            alert("Club activity created successfully!");
        } catch (error) {
            console.error("Error creating club activity:", error);
            alert("Failed to create club activity.");
        }
    };

    return (
        <div className="create-club-activities">
            <h1>Create Club Activities</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Activity Name</label>
                    <input
                        type="text"
                        value={activityName}
                        onChange={(e) => setActivityName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn-primary">Create Activity</button>
            </form>
        </div>
    );
}

export default CreateClubActivities;