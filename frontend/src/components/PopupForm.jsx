import React, { useState, useEffect } from "react";

const PopupForm = ({ onAddActivity, onEditActivity, onClose, editActivity }) => {
    const [activity, setActivity] = useState({
        name: "",
        date: "",
        location: "",
        max_participants: "",
        status: "Upcoming",
        description: "",
    });

    useEffect(() => {
        if (editActivity) {
            setActivity(editActivity);
        }
    }, [editActivity]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setActivity({ ...activity, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editActivity) {
            onEditActivity(activity);
        } else {
            onAddActivity(activity);
        }
    };

    return (
        <div className="popup-form">
            <form onSubmit={handleSubmit}>
                <label>
                    Activity Name:
                    <input type="text" name="name" value={activity.name} onChange={handleChange} required />
                </label>
                <label>
                    Date:
                    <input type="date" name="date" value={activity.date} onChange={handleChange} required />
                </label>
                <label>
                    Location:
                    <input type="text" name="location" value={activity.location} onChange={handleChange} required />
                </label>
                <label>
                    Max Participants:
                    <input type="number" name="max_participants" value={activity.max_participants} onChange={handleChange} required />
                </label>
                <label>
                    Status:
                    <select name="status" value={activity.status} onChange={handleChange} required>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Full">Full</option>
                        <option value="Completed">Completed</option>
                    </select>
                </label>
                <label>
                    Description:
                    <textarea name="description" value={activity.description} onChange={handleChange} />
                </label>
                <button type="submit">{editActivity ? "Update" : "Add"} Activity</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default PopupForm;