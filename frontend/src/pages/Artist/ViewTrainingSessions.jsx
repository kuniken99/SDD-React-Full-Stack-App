import React, { useEffect, useState } from "react";
import api from "../../api";
import "../../styles/TableStyles.css";

const ViewTrainingSessions = () => {
    const [trainingSessions, setTrainingSessions] = useState([]);

    useEffect(() => {
        const fetchTrainingSessions = async () => {
            try {
                const response = await api.get("/api/artist-training-sessions/");
                setTrainingSessions(response.data);
            } catch (error) {
                console.error("Error fetching training sessions:", error);
            }
        };

        fetchTrainingSessions();
    }, []);

    return (
        <div className="training-sessions-page">
            <h1>Training Sessions</h1>
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Date</th>
                            <th>Artist Name</th>
                            <th>Skills Improved</th>
                            <th>Performance Rating</th>
                            <th>Duration (mins)</th>
                            <th>Coach Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trainingSessions.map((session, index) => (
                            <tr key={session.id}>
                                <td>{index + 1}</td>
                                <td>{session.date}</td>
                                <td>{session.artist_name}</td>
                                <td>{session.skills_improved}</td>
                                <td>{session.performance_rating}</td>
                                <td>{session.duration}</td>
                                <td>{session.coach_notes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewTrainingSessions;