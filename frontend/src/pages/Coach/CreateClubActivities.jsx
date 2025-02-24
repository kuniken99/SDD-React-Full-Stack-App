import React, { useState } from "react";
import "../../styles/TableStyles.css";

const CreateClubActivities = () => {
    const [activities, setActivities] = useState([]);
    const [activityName, setActivityName] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [maxParticipants, setMaxParticipants] = useState("");
    const [status, setStatus] = useState("Upcoming");

    const handleAddActivity = () => {
        const newActivity = {
            id: activities.length + 1,
            date,
            activityName,
            location,
            maxParticipants,
            status,
        };
        setActivities([...activities, newActivity]);
        resetForm();
    };

    const resetForm = () => {
        setActivityName("");
        setDate("");
        setLocation("");
        setMaxParticipants("");
        setStatus("Upcoming");
    };

    return (
        <div className="create-club-activities">
            <h1>Create Club Activities</h1>
            <form onSubmit={(e) => { e.preventDefault(); handleAddActivity(); }}>
                <input
                    type="text"
                    placeholder="Activity Name"
                    value={activityName}
                    onChange={(e) => setActivityName(e.target.value)}
                    required
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Max Participants"
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(e.target.value)}
                    required
                />
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                </select>
                <button type="submit">Add Activity</button>
            </form>
            <table>
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
                    {activities.map((activity) => (
                        <tr key={activity.id}>
                            <td>{activity.id}</td>
                            <td>{activity.date}</td>
                            <td>{activity.activityName}</td>
                            <td>{activity.location}</td>
                            <td>{activity.maxParticipants}</td>
                            <td>{activity.status}</td>
                            <td>
                                <button>Edit</button>
                                <button>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CreateClubActivities;