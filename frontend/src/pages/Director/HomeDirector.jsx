import React, { useEffect, useState } from "react";
import "../../styles/Director/HomeDirector.css";
import api from "../../api";
import HomeDance from "../../assets/HomeDance.png";
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
                        
                        <h2>Total Registered Active Artists: {data.total_artists}</h2>
                        <h2>Total Training Sessions: {data.total_sessions}</h2>
                        <h2>Total Hours Logged: {data.total_hours_logged}</h2>
                        <Link to="/manage-artists" className="cta-button">✎ Manage Artists</Link>
                        <Link to="/create-club-activities" className="cta-button g">+ Add New Club Activities</Link>
                        
                        <h3>Recent Injury Reports</h3>
                        <p>Total Active Injuries: {data.ongoing_injuries}</p>
                        <p>Severe Injuries: {data.severe_injuries}</p>
                        <p>Recovering Injuries: {data.recovering_injuries}</p>
                        <Link to="/view-injuries" className="cta-button injury">View All Injuries</Link>

                    </div>
                    <img src={HomeDance} alt="Dancing Performance" className="hero-image" />
                </div>
            </section>
            
        </div>
    );
}

export default HomeDirector;