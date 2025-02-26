import React, { useEffect, useState } from "react";
import api from "../../api";
import "../../styles/TableStyles.css";

const ViewClubActivities = () => {
    const [clubActivities, setClubActivities] = useState([]);
    const [artistInfo, setArtistInfo] = useState(null);

    const fetchClubActivities = async () => {
        try {
            const response = await api.get("/api/artist-club-activities/");
            setClubActivities(response.data.activities);
            setArtistInfo(response.data.artist);
        } catch (error) {
            console.error("Error fetching club activities:", error);
        }
    };

    useEffect(() => {
        fetchClubActivities();
    }, []);

    const handleJoinUnjoin = async (activityId, action) => {
        try {
            await api.post(`/api/artist-club-activities/${activityId}/${action}/`);
            // Update the state directly instead of refetching
            setClubActivities((prevActivities) =>
                prevActivities.map((activity) =>
                    activity.id === activityId
                        ? {
                              ...activity,
                              joined: action === "join",
                              participants_joined:
                                  action === "join"
                                      ? (activity.participants_joined || 0) + 1
                                      : (activity.participants_joined || 0) - 1,
                          }
                        : activity
                )
            );
            setArtistInfo((prevArtistInfo) => ({
                ...prevArtistInfo,
                total_activities_joined:
                    action === "join"
                        ? prevArtistInfo.total_activities_joined + 1
                        : prevArtistInfo.total_activities_joined - 1,
            }));
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
                            <th>Descriptions</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clubActivities.map((activity, index) => (
                            <tr key={activity.id} className={activity.joined ? "joined" : ""}>
                                <td>{index + 1}</td>
                                <td>{activity.name}</td>
                                <td>{activity.date}</td>
                                <td>{activity.location}</td>
                                <td>{activity.participants_joined}/{activity.max_participants}</td>
                                <td>{activity.status}</td>
                                <td>{activity.description}</td>
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