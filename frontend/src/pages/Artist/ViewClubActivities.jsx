import React, { useEffect, useState } from "react";
import api from "../../api";
import "../../styles/TableStyles.css";

const ViewClubActivities = () => {
    const [clubActivities, setClubActivities] = useState([]);
    const [artistInfo, setArtistInfo] = useState(null);

    useEffect(() => {
        const fetchClubActivities = async () => {
            try {
                const response = await api.get("/api/artist-club-activities/");
                setClubActivities(response.data.activities);
                setArtistInfo(response.data.artist);
            } catch (error) {
                console.error("Error fetching club activities:", error);
            }
        };

        fetchClubActivities();
    }, []);

    const handleJoinUnjoin = async (activityId, action) => {
        try {
            await api.post(`/api/artist-club-activities/${activityId}/${action}/`);
            fetchClubActivities();
        } catch (error) {
            console.error(`Error ${action}ing activity:`, error);
        }
    };

    if (!artistInfo) return <p>Loading artist info...</p>;

    return (
        <div className="club-activities-page">
            <h1>Club Activities for {artistInfo.full_name}</h1>
            <p>Total Activities Joined: {artistInfo.total_activities_joined}</p>
            <div className="table-container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Activity Name</th>
                            <th>Date</th>
                            <th>Location</th>
                            <th>Participants Joined</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clubActivities.map((activity, index) => (
                            <tr key={activity.id}>
                                <td>{index + 1}</td>
                                <td>{activity.name}</td>
                                <td>{activity.date}</td>
                                <td>{activity.location}</td>
                                <td>{activity.participants_joined}/{activity.max_participants}</td>
                                <td>{activity.status}</td>
                                <td>
                                    {activity.joined ? (
                                        <button onClick={() => handleJoinUnjoin(activity.id, 'unjoin')} className="cta-button">Unjoin</button>
                                    ) : (
                                        <button onClick={() => handleJoinUnjoin(activity.id, 'join')} className="cta-button">Join</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ViewClubActivities;