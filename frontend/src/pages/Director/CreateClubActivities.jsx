import React, { useState, useEffect } from "react";
import "../../styles/TableStyles.css";
import PopupForm from "../../components/PopupForm";
import api from "../../api"; // Import the API utility

const CreateClubActivities = () => {
    const [activities, setActivities] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [editActivity, setEditActivity] = useState(null);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const response = await api.get("/api/club-activities/");
            setActivities(response.data);
        } catch (error) {
            console.error("Error fetching activities:", error);
        }
    };

    const handleAddActivity = async (newActivity) => {
        try {
            const response = await api.post("/api/create-club-activity/", newActivity);
            setActivities([...activities, response.data]);
            setIsPopupOpen(false);
        } catch (error) {
            console.error("Error adding activity:", error);
        }
    };

    const handleEditActivity = async (updatedActivity) => {
        try {
            const response = await api.put(`/api/club-activities/${updatedActivity.id}/`, updatedActivity);
            setActivities(activities.map(activity => activity.id === updatedActivity.id ? response.data : activity));
            setEditActivity(null);
            setIsPopupOpen(false);
        } catch (error) {
            console.error("Error editing activity:", error);
        }
    };

    const handleDeleteActivity = async (activityId) => {
        try {
            await api.delete(`/api/club-activities/${activityId}/`);
            setActivities(activities.filter(activity => activity.id !== activityId));
        } catch (error) {
            console.error("Error deleting activity:", error);
        }
    };

    const handleOpenPopup = (activity = null) => {
        setEditActivity(activity);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setEditActivity(null);
        setIsPopupOpen(false);
    };

    return (
        <div className="create-club-activities">
            <h1>Create Club Activities</h1>
            <button onClick={() => handleOpenPopup()}>Add New Activity</button>
            {isPopupOpen && (
                <PopupForm
                    onAddActivity={handleAddActivity}
                    onEditActivity={handleEditActivity}
                    onClose={handleClosePopup}
                    editActivity={editActivity}
                />
            )}
            <table className="table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Date</th>
                        <th>Activity Name</th>
                        <th>Location</th>
                        <th>Max Participants</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.map((activity, index) => (
                        <tr key={activity.id}>
                            <td>{index + 1}</td>
                            <td>{activity.date}</td>
                            <td>{activity.name}</td>
                            <td>{activity.location}</td>
                            <td>{activity.max_participants}</td>
                            <td>{activity.status}</td>
                            <td>
                                <button onClick={() => handleOpenPopup(activity)}>Edit</button>
                                <button onClick={() => handleDeleteActivity(activity.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CreateClubActivities;