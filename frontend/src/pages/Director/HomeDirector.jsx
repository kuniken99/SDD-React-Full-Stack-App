import React, { useEffect, useState } from "react";
import "../../styles/Director/HomeDirector.css";
import api from "../../api";
import HomeDance from "../../assets/HomeDance.png";
import DefaultProfilePic from "../../assets/ProfilePic.png";
import { Link, useLocation } from "react-router-dom";

const HomeDirector = () => {
    const location = useLocation();
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/api/director-dashboard/');
                setData(response.data);
            } catch (error) {
                console.error("Error fetching director data:", error);
            }
        };

        fetchData();

        if (location.hash) {
            setTimeout(() => {
                const sectionId = location.hash.replace("#", "");
                document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
            }, 100); // Small delay ensures section is rendered before scrolling
        }
    }, [location]);
        
    if (!data) {
        return <p>Loading...</p>;
    }

    return (
        <div className="home-director">
            {/* Home Section */}
            <section className="hero">
                <div className="section-content">
                    <div className="hero-content">
                        <h1>WELCOME DIRECTOR {data.full_name.toUpperCase()}!</h1>
                        
                        <h3>Total Registered Active Artists: {data.total_artists}</h3>
                        <h3>Total Training Sessions: {data.total_sessions}</h3>
                        <h3>Total Training Hours Logged: {data.total_hours_logged}</h3>
                        <Link to="/manage-artists" className="cta-button">✎ Manage Artists</Link>
                        <Link to="/create-club-activities" className="cta-button g">+ Add New Club Activities</Link>
                        
                        <h3>Recent Injury Reports</h3>
                        <p>Total Active Injuries: {data.ongoing_injuries}</p>
                        <p>Severe Injuries: {data.severe_injuries}</p>
                        <p>Mild Injuries: {data.recovering_injuries}</p>
                        <Link to="/view-injuries" className="cta-button injury">View All Injuries</Link>

                        <h3>Top 3 Artists with Highest Total Sessions</h3>
                        <div className="top-artists">
                            {data.top_artists.map((artist, index) => (
                                <div key={index} className="artist-card">
                                    <img src={artist.profile_picture || DefaultProfilePic} alt={`${artist.name}'s profile`} className="artist-profile-picture" />
                                    <div className="artist-info">
                                        <h4>{artist.name}</h4>
                                        <p>Total Sessions: {artist.total_sessions}</p>
                                        <p>Attendance Rate: {artist.attendance_rate}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <img src={HomeDance} alt="Dancing Performance" className="hero-image" />
                </div>
            </section>
            
        </div>
    );
}

export default HomeDirector;